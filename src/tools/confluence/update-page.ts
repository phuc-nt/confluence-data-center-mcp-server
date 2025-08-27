import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const updatePageTool: Tool = {
  name: 'updatePage',
  description: 'Update Confluence page with version management. WORKFLOW: 1) Use getPageContent to get current version 2) Add +1 to current version for versionNumber 3) Ensure spaceKey is lowercase 4) Use storage format for content. For version comparison: use getPageVersions + getPageContent(versionNumber) to compare different versions.',
  inputSchema: {
    type: 'object',
    properties: {
      pageId: {
        type: 'string',
        description: 'Required: Page ID to update'
      },
      title: {
        type: 'string',
        description: 'Optional: Updated page title'
      },
      content: {
        type: 'string',
        description: 'Optional: Updated content in Confluence storage format (HTML-like markup)'
      },
      spaceKey: {
        type: 'string',
        description: 'Required: Space key in lowercase (e.g. "tbvp" not "TBVP")'
      },
      versionNumber: {
        type: 'number',
        description: 'Required: Current version + 1 (automatically increment after getting from getPageContent)'
      },
      versionMessage: {
        type: 'string',
        description: 'Optional: Version update message for collaboration tracking',
        default: ''
      }
    },
    required: ['pageId', 'spaceKey', 'versionNumber']
  }
};;

export async function executeUpdatePage(
  params: {
    pageId: string;
    title?: string;
    content?: string;
    spaceKey: string;
    versionNumber: number;
    versionMessage?: string;
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    // Get current page data first if partial update
    let currentPage;
    if (!params.title || !params.content) {
      currentPage = await client.get(`/content/${params.pageId}?expand=body.storage,version`);
    }

    // Build request body according to Data Center API v1 format per tool reference section 1.3
    const requestBody: any = {
      id: params.pageId,
      type: 'page',
      title: params.title || currentPage?.title,
      space: {
        key: params.spaceKey
      },
      version: {
        number: params.versionNumber,
        message: params.versionMessage || ''
      }
    };

    // Handle content update
    if (params.content || currentPage?.body?.storage) {
      requestBody.body = {
        storage: {
          value: params.content || currentPage.body.storage.value,
          representation: 'storage'
        }
      };
    }

    // API call with version control per tool reference
    const response = await client.put(`/content/${params.pageId}`, requestBody);

    // Return response structure per tool reference section 1.3
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
          number: response.version?.number,
          by: {
            type: response.version?.by?.type,
            accountId: response.version?.by?.accountId || response.version?.by?.username,
            displayName: response.version?.by?.displayName
          },
          when: response.version?.when,
          message: response.version?.message || ''
        },
        _links: {
          webui: response._links?.webui,
          self: response._links?.self
        }
      }
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference with version conflict detection
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to update page "${params.pageId}". Check page permissions.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Page "${params.pageId}" not found or not accessible.`);
    }
    
    // Version conflict handling per tool reference
    if (error.response?.status === 409) {
      const errorData = error.response?.data;
      const currentVersion = errorData?.currentVersion || 'unknown';
      throw new Error(
        `Version conflict - page has been updated by another user. ` +
        `Current version: ${currentVersion}, provided version: ${params.versionNumber}. ` +
        `Please get the latest version and retry.`
      );
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      if (errorData?.message?.includes('version')) {
        throw new Error(`Invalid version number "${params.versionNumber}". Version must be current version + 1.`);
      }
      throw new Error(`Invalid request data: ${errorData?.message || 'Bad request'}`);
    }

    throw handleConfluenceError(error, 'update page');
  }
}