import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const updateCommentTool: Tool = {
  name: 'updateComment',
  description: 'Edit comments with version control per tool reference',
  inputSchema: {
    type: 'object',
    properties: {
      commentId: {
        type: 'string',
        description: 'Required: Comment ID to update'
      },
      content: {
        type: 'string',
        description: 'Required: Updated comment content in storage format'
      },
      versionNumber: {
        type: 'number',
        description: 'Required: Current version number for optimistic locking'
      },
      versionMessage: {
        type: 'string',
        description: 'Optional: Version update message',
        default: ''
      }
    },
    required: ['commentId', 'content', 'versionNumber']
  }
};

export async function executeUpdateComment(
  params: {
    commentId: string;
    content: string;
    versionNumber: number;
    versionMessage?: string;
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    // Build request body per tool reference section 3.3
    const requestBody = {
      id: params.commentId,
      type: 'comment',
      body: {
        storage: {
          value: params.content,
          representation: 'storage'
        }
      },
      version: {
        number: params.versionNumber,
        message: params.versionMessage || ''
      }
    };

    // API call per tool reference section 3.3
    const response = await client.put(`/content/${params.commentId}`, requestBody);

    // Debug log to see actual response
    console.log('updateComment API Response:', JSON.stringify(response, null, 2));

    // Return response structure per tool reference section 3.3
    return {
      success: true,
      comment: {
        id: response.id || params.commentId,
        type: response.type || 'comment',
        title: response.title || '',
        body: response.body ? {
          storage: response.body.storage ? {
            value: response.body.storage.value || '',
            representation: response.body.storage.representation || 'storage'
          } : null
        } : null,
        version: response.version ? {
          number: response.version.number || params.versionNumber + 1,
          by: response.version.by ? {
            type: response.version.by.type || 'unknown',
            accountId: response.version.by.accountId || response.version.by.username || '',
            displayName: response.version.by.displayName || ''
          } : null,
          when: response.version.when || '',
          message: response.version.message || ''
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
      previousVersion: params.versionNumber,
      updateMessage: params.versionMessage || ''
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    console.error('Error in updateComment:', error.message);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to update comment "${params.commentId}". Check comment permissions.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Comment "${params.commentId}" not found or not accessible.`);
    }
    
    if (error.response?.status === 409) {
      const errorData = error.response?.data;
      const currentVersion = errorData?.currentVersion || 'unknown';
      throw new Error(
        `Version conflict - comment has been updated by another user. ` +
        `Current version: ${currentVersion}, provided version: ${params.versionNumber}. ` +
        `Please get the latest version and retry.`
      );
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      if (errorData?.message?.includes('version')) {
        throw new Error(`Invalid version number "${params.versionNumber}". Version must be current version + 1.`);
      }
      throw new Error(`Invalid comment update data: ${errorData?.message || 'Bad request'}`);
    }

    throw handleConfluenceError(error, 'update comment');
  }
}