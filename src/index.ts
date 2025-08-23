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
          }
        ],
      };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      logger.info(`Tool called: ${request.params.name}`);
      
      try {
        switch (request.params.name) {
          case 'health-check':
            return await healthCheck(request.params.arguments as any);
          
          case 'connection-test':
            return await connectionTest(request.params.arguments as any);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Tool ${request.params.name} not implemented yet`
            );
        }
      } catch (error) {
        logger.error(`Error in tool ${request.params.name}:`, error);
        
        if (error instanceof McpError) {
          throw error;
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