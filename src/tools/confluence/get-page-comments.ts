import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const getPageCommentsTool: Tool = {
  name: 'getPageComments',
  description: 'Complete comment retrieval with threading support per tool reference',
  inputSchema: {
    type: 'object',
    properties: {
      pageId: {
        type: 'string',
        description: 'Required: Page ID to get comments for'
      },
      start: {
        type: 'number',
        description: 'Starting index for pagination (default: 0)',
        default: 0
      },
      limit: {
        type: 'number',
        description: 'Number of comments per page (default: 25, max: 200)',
        default: 25
      },
      expand: {
        type: 'array',
        description: 'Expansion options for comprehensive comment data',
        items: {
          type: 'string',
          enum: ['body.storage', 'version', 'ancestors', 'children.comment']
        },
        default: ['body.storage', 'version', 'ancestors']
      }
    },
    required: ['pageId']
  }
};

export async function executeGetPageComments(
  params: {
    pageId: string;
    start?: number;
    limit?: number;
    expand?: string[];
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    const start = params.start || 0;
    const limit = Math.min(params.limit || 25, 200);
    const expandParams = params.expand || ['body.storage', 'version', 'ancestors'];
    const expandQuery = expandParams.join(',');

    // API call per tool reference section 3.1
    const response = await client.get(`/content/${params.pageId}/child/comment?start=${start}&limit=${limit}&expand=${expandQuery}`);

    // Debug log to see actual response
    console.log('getPageComments API Response:', JSON.stringify(response, null, 2));

    // Return response structure per tool reference section 3.1
    return {
      success: true,
      comments: (response.results && Array.isArray(response.results)) ?
        response.results.map((comment: any) => ({
          id: comment.id || '',
          type: comment.type || 'comment',
          title: comment.title || '',
          body: comment.body ? {
            storage: comment.body.storage ? {
              value: comment.body.storage.value || '',
              representation: comment.body.storage.representation || 'storage'
            } : null
          } : null,
          version: comment.version ? {
            number: comment.version.number || 1,
            by: comment.version.by ? {
              type: comment.version.by.type || 'unknown',
              accountId: comment.version.by.accountId || comment.version.by.username || '',
              displayName: comment.version.by.displayName || ''
            } : null,
            when: comment.version.when || '',
            message: comment.version.message || ''
          } : null,
          ancestors: (comment.ancestors && Array.isArray(comment.ancestors)) ?
            comment.ancestors.map((ancestor: any) => ({
              id: ancestor.id || '',
              type: ancestor.type || '',
              title: ancestor.title || ''
            })) : [],
          children: comment.children && comment.children.comment ? {
            results: (comment.children.comment.results || []).map((childComment: any) => ({
              id: childComment.id || '',
              title: childComment.title || '',
              body: childComment.body ? {
                storage: childComment.body.storage ? {
                  value: childComment.body.storage.value || '',
                  representation: childComment.body.storage.representation || 'storage'
                } : null
              } : null
            }))
          } : null,
          _links: comment._links ? {
            webui: comment._links.webui || '',
            self: comment._links.self || ''
          } : {}
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
    console.error('Error in getPageComments:', error.message);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to access comments for page "${params.pageId}". Check page permissions.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Page "${params.pageId}" not found or comments not accessible.`);
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      throw new Error(`Invalid request: ${errorData?.message || 'Bad request - check pageId format'}`);
    }

    throw handleConfluenceError(error, 'get page comments');
  }
}