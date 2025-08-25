import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const deleteCommentTool: Tool = {
  name: 'deleteComment',
  description: 'Remove comments and cascading replies per tool reference',
  inputSchema: {
    type: 'object',
    properties: {
      commentId: {
        type: 'string',
        description: 'Required: Comment ID to delete (cascades to nested replies)'
      }
    },
    required: ['commentId']
  }
};

export async function executeDeleteComment(
  params: {
    commentId: string;
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    // API call per tool reference section 3.4
    const response = await client.delete(`/content/${params.commentId}`);

    // Debug log to see actual response
    console.log('deleteComment API Response:', JSON.stringify(response, null, 2));

    // Return response structure per tool reference section 3.4
    return {
      success: true,
      comment: {
        id: params.commentId,
        status: 'deleted',
        deletedAt: new Date().toISOString()
      },
      cascadeEffect: true,
      message: 'Comment and all nested replies have been permanently deleted'
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    console.error('Error in deleteComment:', error.message);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to delete comment "${params.commentId}". Check comment permissions.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Comment "${params.commentId}" not found or already deleted.`);
    }
    
    if (error.response?.status === 409) {
      throw new Error(`Cannot delete comment "${params.commentId}". Comment may be protected or have system restrictions.`);
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      throw new Error(`Invalid delete request: ${errorData?.message || 'Bad request - check commentId format'}`);
    }

    throw handleConfluenceError(error, 'delete comment');
  }
}