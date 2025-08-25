import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const getPageContentTool: Tool = {
  name: 'getPageContent',
  description: 'Retrieve complete page data with comprehensive expansion per tool reference',
  inputSchema: {
    type: 'object',
    properties: {
      pageId: {
        type: 'string',
        description: 'Required: Page ID to retrieve'
      },
      expand: {
        type: 'array',
        description: 'Optional: Expansion options for comprehensive data retrieval',
        items: {
          type: 'string',
          enum: [
            'body.storage',
            'body.view', 
            'body.export_view',
            'version',
            'space',
            'ancestors',
            'children.page',
            'descendants.comment'
          ]
        },
        default: ['body.storage', 'version', 'space', 'ancestors', 'children.page', 'descendants.comment']
      }
    },
    required: ['pageId']
  }
};

export async function executeGetPageContent(
  params: {
    pageId: string;
    expand?: string[];
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    // Set default comprehensive expand parameters per tool reference
    const defaultExpand = [
      'body.storage',
      'version',
      'space', 
      'ancestors',
      'children.page',
      'descendants.comment'
    ];
    
    const expandParams = params.expand || defaultExpand;
    const expandQuery = expandParams.join(',');

    // API call with comprehensive expand per tool reference section 1.2
    const response = await client.get(`/content/${params.pageId}?expand=${expandQuery}`);

    // Debug log to see actual response
    console.log('API Response:', JSON.stringify(response, null, 2));

    // Return response structure per tool reference section 1.2 with safe property access
    return {
      success: true,
      page: {
        id: response.id || '',
        type: response.type || '',
        title: response.title || '',
        space: response.space ? {
          id: response.space.id,
          key: response.space.key,
          name: response.space.name,
          _links: response.space._links || {}
        } : null,
        body: response.body ? {
          storage: response.body.storage ? {
            value: response.body.storage.value || '',
            representation: response.body.storage.representation || 'storage'
          } : null,
          view: response.body.view ? {
            value: response.body.view.value || '',
            representation: response.body.view.representation || 'view'
          } : null,
          export_view: response.body.export_view ? {
            value: response.body.export_view.value || '',
            representation: response.body.export_view.representation || 'export_view'
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
        ancestors: (response.ancestors && Array.isArray(response.ancestors)) ? 
          response.ancestors.map((ancestor: any) => ({
            id: ancestor.id || '',
            title: ancestor.title || ''
          })) : [],
        children: (response.children && response.children.page && response.children.page.results) ? {
          results: response.children.page.results.map((child: any) => ({
            id: child.id || '',
            title: child.title || ''
          }))
        } : null,
        descendants: (response.descendants && response.descendants.comment) ? {
          results: response.descendants.comment.results || []
        } : null,
        _links: response._links ? {
          webui: response._links.webui || '',
          self: response._links.self || ''
        } : {}
      }
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    console.error('Error in getPageContent:', error.message);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error(`Insufficient permissions to access page "${params.pageId}". Check page permissions.`);
    }
    
    if (error.response?.status === 404) {
      throw new Error(`Page "${params.pageId}" not found or not accessible.`);
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      throw new Error(`Invalid request: ${errorData?.message || 'Bad request - check pageId format'}`);
    }

    throw handleConfluenceError(error, 'get page content');
  }
}