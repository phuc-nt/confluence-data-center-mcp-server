/**
 * Health check tool for testing MCP server functionality
 * This is a temporary tool for Sprint 1 validation
 */

import { McpToolResult } from '../schemas/common.js';
import { logger } from '../utils/logger.js';

export interface HealthCheckParams {
  verbose?: boolean;
}

export async function healthCheck(params: HealthCheckParams = {}): Promise<McpToolResult> {
  try {
    logger.info('Health check requested', params.verbose ? 'with verbose output' : '');
    
    const timestamp = new Date().toISOString();
    const nodeVersion = process.version;
    const uptime = Math.floor(process.uptime());
    
    let result = `✅ Confluence DC MCP Server Health Check\n`;
    result += `🕐 Timestamp: ${timestamp}\n`;
    result += `⏱️ Uptime: ${uptime}s\n`;
    result += `🟢 Status: Operational\n`;

    if (params.verbose) {
      result += `\n📋 System Information:\n`;
      result += `• Node.js: ${nodeVersion}\n`;
      result += `• Platform: ${process.platform}\n`;
      result += `• Architecture: ${process.arch}\n`;
      result += `• Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\n`;
    }

    return {
      content: [{
        type: 'text',
        text: result
      }]
    };

  } catch (error) {
    logger.error('Health check failed:', error);
    return {
      content: [{
        type: 'text',
        text: `❌ Health check failed: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}