import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const addCommentTool: Tool = {
  name: 'addComment',
  description: 'Add comments and threaded replies per tool reference',
  inputSchema: {
    type: 'object',
    properties: {
      pageId: {
        type: 'string',
        description: 'Required: Page ID to add comment to (container ID)'
      },
      content: {
        type: 'string',
        description: 'Required: Comment content in storage format (supports @mentions and formatting)'
      },
      parentCommentId: {
        type: 'string',
        description: 'Optional: Parent comment ID for threaded replies'
      }
    },
    required: ['pageId', 'content']
  }
};

export async function executeAddComment(
  params: {
    pageId: string;
    content: string;
    parentCommentId?: string;
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    // Build request body per tool reference section 3.2
    const requestBody: any = {
      type: 'comment',
      container: {
        id: params.pageId,
        type: 'page'  // Fix: Add required type field
      },
      body: {
        storage: {
          value: params.content,
          representation: 'storage'
        }
      }
    };

    // Add parent comment for threaded replies
    if (params.parentCommentId) {
      requestBody.ancestors = [
        {
          id: params.parentCommentId
        }
      ];
    }

    // API call per tool reference section 3.2
    const response = await client.post('/content', requestBody);

    // Debug log to see actual response
    console.log('addComment API Response:', JSON.stringify(response, null, 2));

    // Return response structure per tool reference section 3.2
    return {
      success: true,
      comment: {
        id: response.id || '',
        type: response.type || 'comment',
        title: response.title || '',
        body: response.body ? {
          storage: response.body.storage ? {
            value: response.body.storage.value || '',
            representation: response.body.storage.representation || 'storage'
          } : null
        } : null,
        version: response.version ? {
          number: response.version.number || 1,
          by: response.version.by ? {
            type: response.version.by.type || 'unknown',
            accountId: response.version.by.accountId || response.version.by.username || '',
            displayName: response.version.by.displayName || ''
          } : null,
          when: response.version.when || '',
          message: response.version.message || ''
        } : null,
        container: response.container ? {
          id: response.container.id || params.pageId,
          type: response.container.type || 'page',
          title: response.container.title || ''
        } : null,
        ancestors: (response.ancestors && Array.isArray(response.ancestors)) ?
          response.ancestors.map((ancestor: any) => ({
            id: ancestor.id || '',
            type: ancestor.type || '',
            title: ancestor.title || ''
          })) : [],
        _links: response._links ? {
          webui: response._links.webui || '',
          self: response._links.self || ''
        } : {}
      },
      isReply: !!params.parentCommentId,
      parentCommentId: params.parentCommentId || null
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    console.error('Error in addComment:', error.message);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to add comment to page "${params.pageId}". Check page permissions.`);
    }
    
    if (error.response?.status === 404) {
      if (params.parentCommentId) {
        throw new Error(`Page "${params.pageId}" or parent comment "${params.parentCommentId}" not found.`);
      } else {
        throw new Error(`Page "${params.pageId}" not found or not accessible.`);
      }
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      throw new Error(`Invalid comment data: ${errorData?.message || 'Bad request - check content format'}`);
    }

    throw handleConfluenceError(error, 'add comment');
  }
}