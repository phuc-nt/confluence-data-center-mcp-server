import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { createPageTool, executeCreatePage } from './create-page.js';
import { getPageContentTool, executeGetPageContent } from './get-page-content.js';
import { updatePageTool, executeUpdatePage } from './update-page.js';
import { searchPagesTool, executeSearchPages } from './search-pages.js';
import { getSpacesTool, executeGetSpaces } from './get-spaces.js';
import { getPageVersionsTool, executeGetPageVersions } from './get-page-versions.js';
import { deletePageTool, executeDeletePage } from './delete-page.js';
import { getPageCommentsTool, executeGetPageComments } from './get-page-comments.js';
import { addCommentTool, executeAddComment } from './add-comment.js';
import { updateCommentTool, executeUpdateComment } from './update-comment.js';
import { deleteCommentTool, executeDeleteComment } from './delete-comment.js';

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
        case 'getPageVersions':
          result = await executeGetPageVersions(request.params.arguments as any, apiClient);
          break;
        case 'deletePage':
          result = await executeDeletePage(request.params.arguments as any, apiClient);
          break;
        case 'getPageComments':
          result = await executeGetPageComments(request.params.arguments as any, apiClient);
          break;
        case 'addComment':
          result = await executeAddComment(request.params.arguments as any, apiClient);
          break;
        case 'updateComment':
          result = await executeUpdateComment(request.params.arguments as any, apiClient);
          break;
        case 'deleteComment':
          result = await executeDeleteComment(request.params.arguments as any, apiClient);
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
    // Sprint 1: Core Content Management (5 tools)
    createPageTool,
    getPageContentTool,
    updatePageTool,
    searchPagesTool,
    getSpacesTool,
    // Sprint 2: Advanced Page Features (2 tools) 
    getPageVersionsTool,
    deletePageTool,
    // Sprint 3: Comment System (4 tools)
    getPageCommentsTool,
    addCommentTool,
    updateCommentTool,
    deleteCommentTool
  ];
}