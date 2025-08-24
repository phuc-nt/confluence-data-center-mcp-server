# Confluence Data Center MCP Server - Implementation Guide

## Architecture Overview

**Confluence Data Center MCP Server** implements a single-server architecture optimized for enterprise self-hosted deployments. This guide provides technical implementation patterns, API client structure, and development approaches specific to Data Center environments.

For complete business requirements and project scope, see [requirements.md](requirements.md).  
For detailed API endpoints and tool specifications, see [confluence-data-center-tools-reference.md](confluence-data-center-tools-reference.md).

## Data Center API Architecture

### API Characteristics
- **API Version**: REST API v1 (`/wiki/rest/api/`) per tool reference
- **Space Identifiers**: String `spaceKey` for space operations
- **Pagination**: Offset-based with `start`/`limit` parameters  
- **Authentication**: Personal Access Token with `Bearer` header per tool reference
- **Expand Parameters**: Comprehensive utilization for single-call data retrieval

### Enterprise Considerations
- **Custom Context Paths**: Support `/confluence` and custom deployment paths
- **SSL Flexibility**: Configurable certificate verification for self-signed certs
- **Network Integration**: Handle corporate proxies and internal networks

## Server Initialization

### MCP Server Setup Pattern
```typescript
// src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { registerAllConfluenceTools } from './tools/confluence/index.js';
import { ConfluenceConfig } from './schemas/confluence.js';

const confluenceConfig: ConfluenceConfig = {
  baseUrl: process.env.CONFLUENCE_BASE_URL!,
  personalAccessToken: process.env.CONFLUENCE_PERSONAL_ACCESS_TOKEN!,
  verifySSL: process.env.CONFLUENCE_VERIFY_SSL !== 'false'
};

const server = new Server(
  {
    name: process.env.MCP_SERVER_NAME || 'confluence-dc-mcp-server',
    version: process.env.MCP_SERVER_VERSION || '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Context injection for Data Center configuration
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: await getRegisteredTools() };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return await executeToolWithContext(request, confluenceConfig);
});

registerAllConfluenceTools(server, confluenceConfig);
```

### Environment Configuration Validation
```typescript
// src/utils/config-validator.ts
export function validateDataCenterConfig(): void {
  const required = [
    'CONFLUENCE_BASE_URL',
    'CONFLUENCE_PERSONAL_ACCESS_TOKEN'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Data Center specific validation per tool reference
  const baseUrl = process.env.CONFLUENCE_BASE_URL!;
  if (!baseUrl.includes('/confluence') && !baseUrl.endsWith('/wiki/rest/api')) {
    console.warn('Base URL may need /confluence context path and should use /wiki/rest/api endpoint per reference');
  }
}
```

## API Client Implementation

### Data Center API Client Structure
```typescript
// src/utils/confluence-api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import https from 'https';

export interface ConfluenceDataCenterConfig {
  baseUrl: string;                    // e.g., https://confluence.company.com/confluence
  personalAccessToken: string;       // PAT only, no Basic Auth
  verifySSL: boolean;                // Enterprise SSL handling
  timeout?: number;                  // Request timeout (default: 30000)
}

export class ConfluenceDataCenterClient {
  private client: AxiosInstance;
  private config: ConfluenceDataCenterConfig;

  constructor(config: ConfluenceDataCenterConfig) {
    this.config = config;
    
    // Data Center specific axios configuration
    const axiosConfig: AxiosRequestConfig = {
      baseURL: this.normalizeBaseUrl(config.baseUrl),
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.personalAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    // Enterprise SSL configuration
    if (!config.verifySSL) {
      axiosConfig.httpsAgent = new https.Agent({
        rejectUnauthorized: false
      });
    }
    
    this.client = axios.create(axiosConfig);
    this.setupRequestInterceptors();
  }

  private normalizeBaseUrl(baseUrl: string): string {
    // Ensure proper Data Center API path
    if (baseUrl.endsWith('/confluence')) {
      return `${baseUrl}/rest/api`;
    }
    if (baseUrl.endsWith('/rest/api')) {
      return baseUrl;
    }
    return `${baseUrl}/confluence/rest/api`;
  }

  private setupRequestInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Data Center specific error handling
        if (error.response?.status === 401) {
          throw new Error('Authentication failed. Check Personal Access Token.');
        }
        if (error.response?.status === 403) {
          throw new Error('Insufficient permissions for this operation.');
        }
        throw error;
      }
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/space', { params: { limit: 1 } });
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

## Standard Tool Structure

### Tool Registration Pattern
```typescript
// src/tools/confluence/create-page.ts
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterClient } from '../../utils/confluence-api.js';

export const createPageTool: Tool = {
  name: 'createPage',
  description: 'Create new Confluence page in Data Center using spaceKey per tool reference',
  inputSchema: {
    type: 'object',
    properties: {
      spaceKey: { type: 'string', description: 'Required: Space key (string format)' },
      title: { type: 'string', description: 'Required: Page title' },
      content: { type: 'string', description: 'Required: Content in Confluence storage format' },
      parentId: { type: 'string', description: 'Optional: Parent page ID for hierarchy' }
    },
    required: ['spaceKey', 'title', 'content']
  }
};

export async function executeCreatePage(
  params: any,
  client: ConfluenceDataCenterClient
): Promise<any> {
  // Implementation uses Data Center REST API v1 patterns per tool reference
  // API endpoint: POST /wiki/rest/api/content
  // See confluence-data-center-tools-reference.md section 1.1 for complete details
}
```

### Tool-to-API Mapping Reference

For complete API endpoint mappings, request/response formats, and Data Center specific implementations, see [confluence-data-center-tools-reference.md](confluence-data-center-tools-reference.md).

**Key Mapping Notes** (per tool reference):
- `searchPages` → `GET /wiki/rest/api/content/search` with CQL filters (Sprint 2)
- `getPageContent` → `GET /wiki/rest/api/content/{id}?expand=body.storage,version,space,ancestors,children.page`
- `getSpaces` → `GET /wiki/rest/api/space?expand=description,homepage,permissions` with offset pagination  
- `createPage` → `POST /wiki/rest/api/content` with hierarchical ancestors support
- `updatePage` → `PUT /wiki/rest/api/content/{id}` with enhanced version conflict handling
- `deletePage` → `DELETE /wiki/rest/api/content/{id}?status=trashed` for soft delete

## Content Format Handling

### Storage Format
Confluence uses standard XML-like HTML storage format:

```typescript
// src/utils/content-formatter.ts
export function formatStorageContent(content: string): string {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function wrapInStorageFormat(content: string): object {
  return {
    body: {
      storage: {
        value: content,
        representation: 'storage'
      }
    }
  };
}
```

For complete content format examples and validation patterns, see [confluence-data-center-tools-reference.md](confluence-data-center-tools-reference.md) content creation sections.

## Error Handling Strategy

### Data Center Specific Error Patterns
```typescript
// src/utils/error-handler.ts
export class ConfluenceDataCenterError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public confluenceError?: any
  ) {
    super(message);
    this.name = 'ConfluenceDataCenterError';
  }
}

export function handleDataCenterApiError(error: any): never {
  if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
    throw new Error('SSL certificate error. Set CONFLUENCE_VERIFY_SSL=false for self-signed certificates.');
  }
  
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    throw new Error('Cannot connect to Confluence Data Center. Check CONFLUENCE_BASE_URL and network access.');
  }
  
  throw new ConfluenceDataCenterError(
    error.response?.data?.message || error.message,
    error.response?.status || 500,
    error.response?.data
  );
}
```

## Data Center Integration Patterns

### Space Key Handling
```typescript
export function validateSpaceKey(spaceKey: string): boolean {
  // Space keys are alphanumeric strings
  return /^[A-Z0-9]+$/.test(spaceKey);
}
```

### Pagination Implementation
```typescript
export interface PaginationParams {
  start?: number;    // Starting index (default: 0)
  limit?: number;    // Results per page (default: 25, max: 200)
}

export function buildPaginationQuery(params: PaginationParams): string {
  const start = params.start || 0;
  const limit = Math.min(params.limit || 25, 200);
  return `start=${start}&limit=${limit}`;
}
```

## Development Environment Setup

### Local Development Configuration
```bash
# .env.development
CONFLUENCE_BASE_URL=https://confluence.company.com/confluence
CONFLUENCE_PERSONAL_ACCESS_TOKEN=your_pat_token_here
CONFLUENCE_VERIFY_SSL=false
MCP_SERVER_NAME=confluence-dc-mcp-server-dev
MCP_SERVER_VERSION=1.0.0-dev
```

### Integration Testing
```typescript
// tests/integration/connection.test.ts
describe('Confluence Connection', () => {
  it('should connect with PAT authentication', async () => {
    const client = new ConfluenceDataCenterClient(testConfig);
    expect(await client.testConnection()).toBe(true);
  });
  
  it('should handle self-signed certificates', async () => {
    const client = new ConfluenceDataCenterClient({
      ...testConfig,
      verifySSL: false
    });
    expect(await client.testConnection()).toBe(true);
  });
});
```

## Deployment Considerations

### Enterprise Deployment Pattern
- **Docker Support**: Container-based deployment for enterprise environments
- **Network Configuration**: Handle corporate proxies and internal networks
- **SSL Certificates**: Support both CA-signed and self-signed certificates
- **Environment Variables**: Secure PAT storage and configuration management

### Production Configuration
```typescript
// src/config/production.ts
export const productionConfig = {
  // PAT should be stored securely (environment variables, secrets management)
  personalAccessToken: process.env.CONFLUENCE_PERSONAL_ACCESS_TOKEN!,
  // Production should verify SSL unless specifically configured otherwise
  verifySSL: process.env.CONFLUENCE_VERIFY_SSL !== 'false',
  // Production timeout handling
  timeout: parseInt(process.env.CONFLUENCE_TIMEOUT || '30000')
};
```

## Security Considerations

### Personal Access Token Management
- **Generation**: Users generate PATs from Confluence User Profile → Personal Access Tokens
- **Scope**: Configure minimal required permissions for PAT
- **Rotation**: Support PAT rotation without service interruption
- **Storage**: Never log or expose PAT values

### Network Security
- **SSL/TLS**: Default to certificate verification, configurable for development
- **Network Access**: Handle corporate firewalls and proxy configurations
- **Internal Networks**: Support internal-only Data Center deployments

## Next Steps

1. **Review API Reference**: See [confluence-data-center-tools-reference.md](confluence-data-center-tools-reference.md) for complete endpoint documentation
2. **Check Project Roadmap**: See [project-roadmap.md](../01_plan/project-roadmap.md) for implementation timeline
3. **Start Development**: Begin with [sprint implementation files](../02_implement/) for detailed task breakdown

---

**Implementation Focus**: This guide provides Data Center specific patterns. For complete API specifications and tool implementations, reference the tools documentation linked throughout this guide.