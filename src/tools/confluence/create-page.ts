import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleDataCenterApiError } from '../../utils/error-handler.js';

export const createPageTool: Tool = {
  name: 'createPage',
  description: 'Create a new Confluence page in Data Center using spaceKey',
  inputSchema: {
    type: 'object',
    properties: {
      spaceKey: {
        type: 'string',
        description: 'Required: Space key (e.g., "DEV", "PROJ")'
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
        description: 'Optional: Parent page ID for hierarchy'
      },
      representation: {
        type: 'string',
        description: 'Optional: Content representation (default: "storage")',
        enum: ['storage', 'wiki']
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
    representation?: string;
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    // Validate spaceKey format (alphanumeric only)
    if (!/^[A-Z0-9]+$/.test(params.spaceKey)) {
      throw new Error('Invalid spaceKey format. Must be alphanumeric (e.g., "DEV", "PROJ")');
    }

    // Build request body according to Data Center API v1 format
    const requestBody: any = {
      type: 'page',
      title: params.title,
      space: {
        key: params.spaceKey
      },
      body: {
        storage: {
          value: params.content,
          representation: params.representation || 'storage'
        }
      }
    };

    // Add parent hierarchy if specified
    if (params.parentId) {
      requestBody.ancestors = [
        {
          id: params.parentId
        }
      ];
    }

    const response = await client.post('/content', requestBody);

    return {
      success: true,
      page: {
        id: response.id,
        type: response.type,
        status: response.status,
        title: response.title,
        space: {
          id: response.space.id,
          key: response.space.key,
          name: response.space.name
        },
        version: {
          by: {
            type: response.version.by.type,
            username: response.version.by.username,
            displayName: response.version.by.displayName
          },
          when: response.version.when,
          number: response.version.number,
          message: response.version.message || 'Initial version'
        },
        _links: {
          webui: response._links.webui,
          edit: response._links.edit,
          self: response._links.self
        }
      }
    };
  } catch (error: any) {
    // Handle specific Data Center error cases
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to create page in space "${params.spaceKey}". Check space permissions.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Space "${params.spaceKey}" not found or not accessible.`);
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      if (errorData?.message?.includes('parent')) {
        throw new Error(`Invalid parent page ID "${params.parentId}". Parent page may not exist or not be in the same space.`);
      }
      throw new Error(`Invalid request data: ${errorData?.message || 'Bad request'}`);
    }

    handleDataCenterApiError(error);
  }
}