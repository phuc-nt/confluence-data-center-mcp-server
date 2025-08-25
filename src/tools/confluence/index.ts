import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { createPageTool, executeCreatePage } from './create-page.js';
import { getPageContentTool, executeGetPageContent } from './get-page-content.js';
import { updatePageTool, executeUpdatePage } from './update-page.js';
import { searchPagesTool, executeSearchPages } from './search-pages.js';
import { getSpacesTool, executeGetSpaces } from './get-spaces.js';

export function registerConfluenceTools(
  server: Server,
  apiClient: ConfluenceDataCenterApiClient
): void {
  // Register confluence tools
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      let result;
      
      switch (request.params.name) {
        case 'createPage':
          result = await executeCreatePage(request.params.arguments as any, apiClient);
          break;
        case 'getPageContent':
          result = await executeGetPageContent(request.params.arguments as any, apiClient);
          break;
        case 'updatePage':
          result = await executeUpdatePage(request.params.arguments as any, apiClient);
          break;
        case 'searchPages':
          result = await executeSearchPages(request.params.arguments as any, apiClient);
          break;
        case 'getSpaces':
          result = await executeGetSpaces(request.params.arguments as any, apiClient);
          break;
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
      
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (error: any) {
      return { 
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }, null, 2) }],
        isError: true
      };
    }
  });
}

export function getConfluenceTools() {
  return [
    createPageTool,
    getPageContentTool,
    updatePageTool,
    searchPagesTool,
    getSpacesTool
  ];
}