import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const createPageTool: Tool = {
  name: 'createPage',
  description: 'Create new Confluence page in Data Center using spaceKey with hierarchical organization per tool reference',
  inputSchema: {
    type: 'object',
    properties: {
      spaceKey: {
        type: 'string',
        description: 'Required: Space key (string format, e.g., "DEV", "PROJ")'
      },
      title: {
        type: 'string',
        description: 'Required: Page title'
      },
      content: {
        type: 'string',
        description: 'Required: Content in Confluence storage format (XML-like HTML)'
      },
      parentId: {
        type: 'string',
        description: 'Optional: Parent page ID for hierarchical organization'
      }
    },
    required: ['spaceKey', 'title', 'content']
  }
};

export async function executeCreatePage(
  params: {
    spaceKey: string;
    title: string;
    content: string;
    parentId?: string;
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    // Validate spaceKey format (alphanumeric only)
    if (!/^[A-Z0-9]+$/.test(params.spaceKey)) {
      throw new Error('Invalid spaceKey format. Must be alphanumeric (e.g., "DEV", "PROJ")');
    }

    // Build request body according to Data Center API v1 format per tool reference
    const requestBody: any = {
      type: 'page',
      title: params.title,
      space: {
        key: params.spaceKey
      },
      body: {
        storage: {
          value: params.content,
          representation: 'storage'
        }
      }
    };

    // Add parent hierarchy if specified per tool reference
    if (params.parentId) {
      requestBody.ancestors = [
        {
          id: params.parentId
        }
      ];
    }

    const response = await client.post('/content', requestBody);

    // Return response structure per tool reference section 1.1
    return {
      success: true,
      page: {
        id: response.id,
        type: response.type,
        title: response.title,
        space: {
          id: response.space?.id,
          key: response.space?.key,
          name: response.space?.name
        },
        version: {
          number: response.version?.number || 1,
          by: {
            type: response.version?.by?.type || 'known',
            accountId: response.version?.by?.accountId || response.version?.by?.username,
            displayName: response.version?.by?.displayName
          },
          when: response.version?.when,
          message: response.version?.message || ''
        },
        ancestors: response.ancestors || (params.parentId ? [{ id: params.parentId }] : []),
        _links: {
          webui: response._links?.webui,
          self: response._links?.self
        }
      }
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to create page in space "${params.spaceKey}". Check space permissions.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Space "${params.spaceKey}" not found or not accessible.`);
    }
    
    if (error.response?.status === 409) {
      throw new Error(`Conflict creating page. Title "${params.title}" may already exist in space "${params.spaceKey}".`);
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      if (errorData?.message?.includes('parent')) {
        throw new Error(`Invalid parent page ID "${params.parentId}". Parent page may not exist or not be in the same space.`);
      }
      throw new Error(`Invalid request data: ${errorData?.message || 'Bad request'}`);
    }

    throw handleConfluenceError(error, 'create page');
  }
}