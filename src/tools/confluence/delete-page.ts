import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const deletePageTool: Tool = {
  name: 'deletePage',
  description: 'Permanent page deletion (admin permissions required). Note: Data Center version performs permanent deletion only.',
  inputSchema: {
    type: 'object',
    properties: {
      pageId: {
        type: 'string',
        description: 'Required: Page ID to delete permanently'
      }
    },
    required: ['pageId']
  }
};;

export async function executeDeletePage(
  params: {
    pageId: string;
    status?: string;
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    // Build API endpoint per tool reference section 1.4
    // Note: Data Center may not support status=trashed parameter
    let endpoint = `/content/${params.pageId}`;

    // API call per tool reference section 1.4 - permanent delete only
    const response = await client.delete(endpoint);

    // Debug log to see actual response
    console.log('deletePage API Response:', JSON.stringify(response, null, 2));

    // Return response structure per tool reference section 1.4
    return {
      success: true,
      page: {
        id: response.id || params.pageId,
        status: 'deleted',
        title: response.title || '',
        version: response.version ? {
          number: response.version.number || 0,
          when: response.version.when || new Date().toISOString()
        } : {
          number: 0,
          when: new Date().toISOString()
        },
        _links: response._links ? {
          self: response._links.self || ''
        } : {}
      },
      deleteType: 'permanent',
      recoverable: false
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    console.error('Error in deletePage:', error.message);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to delete page "${params.pageId}". Check page permissions and admin rights.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Page "${params.pageId}" not found or already deleted.`);
    }
    
    if (error.response?.status === 409) {
      throw new Error(`Cannot delete page "${params.pageId}". Page may have child pages or be protected.`);
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      throw new Error(`Invalid delete request: ${errorData?.message || 'Bad request - check pageId format'}`);
    }

    throw handleConfluenceError(error, 'delete page');
  }
}