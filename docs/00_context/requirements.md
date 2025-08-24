# Confluence Data Center MCP Server - Requirements & Overview

## Project Overview

**Confluence Data Center MCP Server** is a Model Context Protocol (MCP) server that enables AI assistants like Claude, Cline, Cursor, and other MCP-compatible tools to interact with self-hosted Atlassian Confluence Data Center instances using username/password or personal access token authentication. Built with single server architecture for enhanced AI client compatibility and fast feature delivery.

## Business Objectives

### Primary Goals
- **Enterprise Integration**: Enable seamless Confluence Data Center operations through AI assistants
- **Self-Hosted Support**: Work with on-premises and private cloud Confluence deployments
- **Rapid Feature Delivery**: Focus on releasing functionality quickly rather than optimization
- **Simple Architecture**: Single server with essential tools only
- **Developer Productivity**: Reduce manual Confluence administration tasks

### Success Metrics
- **Feature Velocity**: Release new tools within 1-2 sprints
- **Tool Coverage**: Support essential Confluence operations (11 tools)
- **AI Compatibility**: Work across Claude, Cline, Cursor platforms
- **Enterprise Adoption**: Support various Data Center deployment configurations
- **Simple Architecture**: Single server, no module complexity

## Core Features & Capabilities

### Essential Tools (Single Server - 11 tools per tool reference)
**Focus**: Complete Confluence operations with enterprise workflow support

#### Page Management Tools (5 tools - Sprint 1)
- **createPage**: Create new pages with hierarchical organization support (spaceKey, ancestors)
- **getPageContent**: Complete page data retrieval with comprehensive expansion (content, labels, versions, ancestors, children)
- **updatePage**: Page content and title modification with version control and conflict handling
- **deletePage**: Enhanced page removal with soft delete (trashing) and permanent delete options
- **getSpaces**: Space discovery with permissions and metadata for navigation and context

#### Search & Discovery Tools (2 tools - Sprint 2)
- **searchPages**: Universal page search with advanced CQL filtering and multi-criteria support
- **getPageVersions**: Complete version history for change tracking and rollback preparation

#### Comment Management Tools (4 tools - Sprint 3)
- **getPageComments**: Complete comment retrieval with threading support for reviews and discussions
- **addComment**: Add comments and threaded replies with mention support
- **updateComment**: Edit comments with version control for corrections and context additions
- **deleteComment**: Remove comments with cascading delete for nested replies

## Technical Architecture

### Technology Stack
- **Language**: TypeScript with strict mode
- **Runtime**: Node.js 16+ with ES modules
- **Protocol**: Model Context Protocol (MCP) SDK
- **APIs**: Confluence Server/Data Center REST API
- **Authentication**: Personal Access Token with Bearer header per tool reference
- **Build System**: TypeScript compiler

### Simple Architecture Pattern
```
confluence-dc-mcp-server/
└── Single Server (11 tools) - All essential Confluence operations
```

### Key Architecture Principles
- **Tools-Only Architecture**: Direct action execution, no resources layer
- **Fast Deployment**: Prioritize functionality over performance optimization
- **Bearer Token Authentication**: Personal Access Token with Bearer header per tool reference
- **Simple Error Handling**: Basic error responses, no complex retry logic
- **Minimal Dependencies**: Core libraries only for rapid development

## API Integration Requirements

### Confluence Data Center APIs Used
- **Primary**: Confluence Data Center REST API v1 per tool reference
- **Base URL**: `https://{your-domain}/wiki/rest/api` or custom context path per tool reference  
- **Space Identifier**: String spaceKey for space operations
- **Pagination**: Offset-based with start/limit parameters
- **Authentication**: Bearer Personal Access Token header per tool reference

For complete authentication options, API endpoints, and technical implementation details, see [confluence-data-center-tools-reference.md](confluence-data-center-tools-reference.md).

### Data Center Specific Features
- **Custom Context Paths**: Support `/confluence` and custom deployment paths
- **SSL Certificate Flexibility**: Configurable verification for self-signed certificates
- **Enterprise Network**: Handle internal network restrictions and proxy configurations

## Deployment Configuration

### Single Configuration
- **Confluence Data Center MCP Server** (11 tools): Complete essential functionality in one server

### Installation Methods
- **NPM Distribution**: Global installation via npm registry
- **Source Build**: Direct TypeScript compilation
- **Docker Support**: Containerized deployment for enterprise environments
- **Single Entry Point**: `confluence-dc-mcp-server`

### Environment Configuration
```bash
CONFLUENCE_BASE_URL=https://your-confluence.company.com/confluence
CONFLUENCE_PERSONAL_ACCESS_TOKEN=your-pat
CONFLUENCE_VERIFY_SSL=true (set to false for self-signed certificates)
MCP_SERVER_NAME=confluence-dc-mcp-server
MCP_SERVER_VERSION=1.0.0
```

## Success Criteria

### Phase 1 - Foundation (Sprint 1)
- ✅ MCP server architecture setup
- ✅ Personal Access Token authentication
- ✅ Page management: create, update, delete
- ✅ Page content retrieval with labels
- ✅ SSL certificate handling

### Phase 2 - Search & Discovery (Sprint 2)  
- ✅ Universal page search functionality
- ✅ Space discovery and listing
- ✅ Page version history access
- ✅ Comment system implementation

### Phase 3 - Production Ready (Sprint 3)
- ✅ NPM package distribution
- ✅ Docker containerization
- ✅ Documentation completion
- ✅ AI client compatibility testing
- ✅ All 11 tools operational

## Data Center Specific Requirements

### Authentication
- **Method**: Personal Access Token authentication only (modern, secure)
- **Configuration**: Environment variable based configuration

### Network & Security
- **SSL Handling**: Configurable SSL certificate verification
- **Custom Domains**: Support various Data Center domain configurations
- **Context Paths**: Handle custom Confluence context paths
- **Internal Networks**: Work within corporate network restrictions

### Enterprise Features
- **Permission Respect**: Honor Data Center user permissions and space restrictions
- **Audit Compliance**: Basic operation logging for enterprise audit requirements
- **Multi-Instance**: Support multiple Data Center instances via configuration

## Non-Requirements (Explicitly Excluded)

### Performance Optimizations
- **No caching layers**: Simple direct API calls
- **No request batching**: Individual tool calls
- **No connection pooling**: Standard HTTP requests
- **No response optimization**: Direct API response forwarding

### Security Enhancements
- **No OAuth implementation**: Personal Access Token only
- **No rate limiting**: Basic API error handling
- **No request validation**: Trust MCP client input
- **No advanced audit logging**: Simple operation logging only

### Advanced Features
- **No webhook support**: Polling-based updates only
- **No real-time sync**: On-demand data retrieval
- **No bulk operations**: Individual item processing
- **No advanced search**: Basic API filtering only
- **No clustering support**: Single instance deployment

## Documentation Strategy

- **Implementation Guide**: Developer-focused technical documentation
- **Roadmap Planning**: Phase-based delivery tracking
- **Sprint Management**: Detailed task and progress tracking
- **API Reference**: Tool-to-API mapping for Data Center APIs
- **Enterprise Setup**: Data Center specific configuration guides

## Risk Considerations

### Technical Risks
- **API Compatibility**: Different Data Center versions API variations
- **Network Restrictions**: Corporate firewall and proxy configurations
- **PAT Generation**: Users need to generate Personal Access Tokens
- **SSL Certificates**: Self-signed certificate handling

### Enterprise Risks
- **Permission Models**: Complex Data Center permission structures
- **Instance Variations**: Different Data Center configurations
- **Security Policies**: Corporate security requirement compliance

### Mitigation Strategies
- **Rapid Iteration**: Quick fixes over comprehensive solutions
- **Simple Architecture**: Avoid complex abstractions
- **Flexible Configuration**: Environment-based configuration options
- **Documentation Focus**: Clear setup guides for enterprise environments

---

**Next Steps**: Review [implementation-guide.md](implementation-guide.md) for technical implementation details and development approach specific to Data Center deployments.