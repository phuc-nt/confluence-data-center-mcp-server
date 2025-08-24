import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { createPageTool, executeCreatePage } from './create-page.js';

export function registerConfluenceTools(
  server: Server,
  apiClient: ConfluenceDataCenterApiClient
): void {
  // Register createPage tool
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === 'createPage') {
      try {
        const result = await executeCreatePage(request.params.arguments as any, apiClient);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (error: any) {
        return { 
          content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }, null, 2) }],
          isError: true
        };
      }
    }
    
    throw new Error(`Unknown tool: ${request.params.name}`);
  });
}

export function getConfluenceTools() {
  return [
    createPageTool
  ];
}