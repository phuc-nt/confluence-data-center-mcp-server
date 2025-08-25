import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const getSpacesTool: Tool = {
  name: 'getSpaces',
  description: 'Space discovery with permissions and metadata per tool reference',
  inputSchema: {
    type: 'object',
    properties: {
      start: {
        type: 'number',
        description: 'Starting index for pagination (default: 0)',
        default: 0
      },
      limit: {
        type: 'number',
        description: 'Number of results per page (default: 25, max: 200)',
        default: 25
      },
      type: {
        type: 'string',
        description: 'Filter by space type (global, personal)',
        enum: ['global', 'personal']
      },
      status: {
        type: 'string',
        description: 'Filter by space status (current, archived)',
        enum: ['current', 'archived']
      },
      expand: {
        type: 'array',
        description: 'Expansion options for comprehensive space data',
        items: {
          type: 'string',
          enum: ['description', 'homepage', 'permissions', 'icon', 'theme']
        },
        default: ['description', 'homepage', 'permissions']
      }
    },
    additionalProperties: false
  }
};

export async function executeGetSpaces(
  params: {
    start?: number;
    limit?: number;
    type?: string;
    status?: string;
    expand?: string[];
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    const start = params.start || 0;
    const limit = Math.min(params.limit || 25, 200);
    const expandParams = params.expand || ['description', 'homepage', 'permissions'];
    const expandQuery = expandParams.join(',');

    // Build API endpoint per tool reference section 1.5
    let endpoint = `/space?start=${start}&limit=${limit}&expand=${expandQuery}`;
    
    // Add optional filters
    if (params.type) {
      endpoint += `&type=${params.type}`;
    }
    
    if (params.status) {
      endpoint += `&status=${params.status}`;
    }

    const response = await client.get(endpoint);

    // Return response structure per tool reference section 1.5
    return {
      success: true,
      spaces: response.results?.map((space: any) => ({
        id: space.id,
        key: space.key,
        name: space.name,
        type: space.type,
        status: space.status,
        description: space.description ? {
          plain: {
            value: space.description.plain?.value || space.description.value || '',
            representation: space.description.plain?.representation || space.description.representation || 'plain'
          }
        } : undefined,
        homepage: space.homepage ? {
          id: space.homepage.id,
          title: space.homepage.title,
          _links: space.homepage._links
        } : undefined,
        permissions: space.permissions?.map((permission: any) => ({
          subjects: {
            user: permission.subjects?.user ? {
              results: permission.subjects.user.results?.map((user: any) => ({
                type: user.type,
                accountId: user.accountId || user.username,
                displayName: user.displayName
              })) || []
            } : undefined,
            group: permission.subjects?.group ? {
              results: permission.subjects.group.results?.map((group: any) => ({
                type: group.type,
                name: group.name
              })) || []
            } : undefined
          },
          operation: {
            operation: permission.operation?.operation,
            targetType: permission.operation?.targetType
          }
        })) || [],
        icon: space.icon ? {
          path: space.icon.path,
          width: space.icon.width,
          height: space.icon.height
        } : undefined,
        _links: {
          webui: space._links?.webui,
          self: space._links?.self
        }
      })) || [],
      pagination: {
        start: response.start || start,
        limit: response.limit || limit,
        size: response.size || 0,
        totalSize: response.totalSize || response.size || 0
      },
      _links: {
        next: response._links?.next,
        base: response._links?.base
      }
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Insufficient permissions to list spaces. Check space access permissions.');
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      throw new Error(`Invalid request parameters: ${errorData?.message || 'Bad request - check pagination or filter parameters'}`);
    }

    throw handleConfluenceError(error, 'get spaces');
  }
}