#!/usr/bin/env node

/**
 * Confluence Data Center MCP Server
 * Entry point for the Model Context Protocol server providing Confluence integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { validateEnvironment } from './utils/error-handler.js';
import { healthCheck } from './tools/health-check.js';
import { connectionTest } from './tools/connection-test.js';
import { initializeServerContext } from './utils/server-context.js';
import { getConfluenceTools, registerConfluenceTools } from './tools/confluence/index.js';

// Load environment variables
dotenv.config();

/**
 * Server configuration interface
 */
interface ServerConfig {
  name: string;
  version: string;
}

/**
 * Main server initialization and startup
 */
async function main() {
  try {
    // Validate environment configuration
    validateEnvironment();

    const config: ServerConfig = {
      name: process.env.MCP_SERVER_NAME || 'confluence-dc-mcp-server',
      version: process.env.MCP_SERVER_VERSION || '1.0.0'
    };

    logger.info(`Starting ${config.name} v${config.version}`);

    // Initialize server context with Confluence API client
    const serverContext = initializeServerContext();
    
    // Test API connection on startup
    const connectionResult = await serverContext.confluenceApi.testConnection();
    if (connectionResult.success) {
      logger.info(`✅ ${connectionResult.message}`);
    } else {
      logger.warn(`⚠️ ${connectionResult.message}`);
      logger.warn('Server will start but some tools may not work correctly.');
    }

    // Create MCP server instance
    const server = new Server(
      {
        name: config.name,
        version: config.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Setup tool handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      const confluenceTools = getConfluenceTools();
      
      return {
        tools: [
          {
            name: 'health-check',
            description: 'Check server health and status - temporary tool for Sprint 1 validation',
            inputSchema: {
              type: 'object',
              properties: {
                verbose: {
                  type: 'boolean',
                  description: 'Include detailed system information in the response',
                  default: false
                }
              },
              additionalProperties: false
            }
          },
          {
            name: 'connection-test',
            description: 'Test Confluence Data Center API connection and authentication - temporary tool for Sprint 1 validation',
            inputSchema: {
              type: 'object',
              properties: {
                detailed: {
                  type: 'boolean',
                  description: 'Include detailed connection information in the response',
                  default: false
                }
              },
              additionalProperties: false
            }
          },
          ...confluenceTools
        ],
      };
    });

    // Setup unified tool handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      logger.info(`Tool called: ${request.params.name}`);
      
      try {
        // Handle system tools
        switch (request.params.name) {
          case 'health-check':
            return await healthCheck(request.params.arguments as any);
          
          case 'connection-test':
            return await connectionTest(request.params.arguments as any);
        }
        
        // Handle confluence tools - All 11 tools
        const confluenceTools = [
          // Sprint 1: Core Content Management
          'createPage', 'getPageContent', 'updatePage', 'searchPages', 'getSpaces',
          // Sprint 2: Advanced Page Features  
          'getPageVersions', 'deletePage',
          // Sprint 3: Comment System
          'getPageComments', 'addComment', 'updateComment', 'deleteComment'
        ];
        if (confluenceTools.includes(request.params.name)) {
          // Delegate to confluence tools handler logic
          const { executeCreatePage } = await import('./tools/confluence/create-page.js');
          const { executeGetPageContent } = await import('./tools/confluence/get-page-content.js');
          const { executeUpdatePage } = await import('./tools/confluence/update-page.js');
          const { executeSearchPages } = await import('./tools/confluence/search-pages.js');
          const { executeGetSpaces } = await import('./tools/confluence/get-spaces.js');
          const { executeGetPageVersions } = await import('./tools/confluence/get-page-versions.js');
          const { executeDeletePage } = await import('./tools/confluence/delete-page.js');
          const { executeGetPageComments } = await import('./tools/confluence/get-page-comments.js');
          const { executeAddComment } = await import('./tools/confluence/add-comment.js');
          const { executeUpdateComment } = await import('./tools/confluence/update-comment.js');
          const { executeDeleteComment } = await import('./tools/confluence/delete-comment.js');
          
          let result;
          switch (request.params.name) {
            case 'createPage':
              result = await executeCreatePage(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'getPageContent':
              result = await executeGetPageContent(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'updatePage':
              result = await executeUpdatePage(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'searchPages':
              result = await executeSearchPages(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'getSpaces':
              result = await executeGetSpaces(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'getPageVersions':
              result = await executeGetPageVersions(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'deletePage':
              result = await executeDeletePage(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'getPageComments':
              result = await executeGetPageComments(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'addComment':
              result = await executeAddComment(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'updateComment':
              result = await executeUpdateComment(request.params.arguments as any, serverContext.confluenceApi);
              break;
            case 'deleteComment':
              result = await executeDeleteComment(request.params.arguments as any, serverContext.confluenceApi);
              break;
          }
          
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
        
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool ${request.params.name} not found`
        );
      } catch (error) {
        logger.error(`Error in tool ${request.params.name}:`, error);
        
        if (error instanceof McpError) {
          throw error;
        }
        
        // Handle confluence tool errors with success: false format - All 11 tools
        const confluenceTools = [
          'createPage', 'getPageContent', 'updatePage', 'searchPages', 'getSpaces',
          'getPageVersions', 'deletePage', 'getPageComments', 'addComment', 'updateComment', 'deleteComment'
        ];
        if (confluenceTools.includes(request.params.name)) {
          return { 
            content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }, null, 2) }],
            isError: true
          };
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Internal error in tool ${request.params.name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });

    // Initialize stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info(`${config.name} started successfully on stdio transport`);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle process shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});