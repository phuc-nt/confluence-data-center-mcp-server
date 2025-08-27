import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const getPageVersionsTool: Tool = {
  name: 'getPageVersions',
  description: 'Get complete version history of a page with links to access historical content. Use with getPageContent(versionNumber) to retrieve specific version content.',
  inputSchema: {
    type: 'object',
    properties: {
      pageId: {
        type: 'string',
        description: 'Required: Page ID to get version history for'
      },
      start: {
        type: 'number',
        description: 'Starting index for pagination (default: 0)',
        default: 0
      },
      limit: {
        type: 'number',
        description: 'Number of versions per page (default: 25, max: 200)',
        default: 25
      }
    },
    required: ['pageId']
  }
};;

export async function executeGetPageVersions(
  params: {
    pageId: string;
    start?: number;
    limit?: number;
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    const start = params.start || 0;
    const limit = Math.min(params.limit || 25, 200);

    // Using experimental endpoint for complete version history access
    const response = await client.get(`/experimental/content/${params.pageId}/version?start=${start}&limit=${limit}`);

    // Debug log to see actual response
    console.log('getPageVersions API Response:', JSON.stringify(response, null, 2));

    // Return response structure with enhanced version data
    return {
      success: true,
      versions: (response.results && Array.isArray(response.results)) ?
        response.results.map((version: any) => ({
          number: version.number || 0,
          by: version.by ? {
            type: version.by.type || 'unknown',
            accountId: version.by.accountId || version.by.username || '',
            displayName: version.by.displayName || '',
            profilePicture: version.by.profilePicture ? {
              path: version.by.profilePicture.path || ''
            } : null
          } : null,
          when: version.when || '',
          message: version.message || '',
          minorEdit: version.minorEdit || false,
          _links: version._links ? {
            self: version._links.self || '',
            content: `/rest/api/content/${params.pageId}?status=historical&version=${version.number}&expand=body.storage`
          } : {
            content: `/rest/api/content/${params.pageId}?status=historical&version=${version.number}&expand=body.storage`
          }
        })) : [],
      pagination: {
        start: response.start || start,
        limit: response.limit || limit,
        size: response.size || 0,
        totalSize: response.totalSize || response.size || 0
      },
      _links: response._links ? {
        next: response._links.next || null,
        base: response._links.base || null
      } : {}
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    console.error('Error in getPageVersions:', error.message);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to access version history for page "${params.pageId}". Check page permissions.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Page "${params.pageId}" not found or version history not accessible.`);
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      throw new Error(`Invalid request: ${errorData?.message || 'Bad request - check pageId format'}`);
    }

    throw handleConfluenceError(error, 'get page versions');
  }
}