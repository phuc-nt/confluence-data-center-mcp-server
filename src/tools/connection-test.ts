/**
 * Connection test tool for validating Confluence API connectivity
 * This is a temporary tool for Sprint 1 validation
 */

import { McpToolResult } from '../schemas/common.js';
import { getServerContext } from '../utils/server-context.js';
import { logger } from '../utils/logger.js';

export interface ConnectionTestParams {
  detailed?: boolean;
}

export async function connectionTest(params: ConnectionTestParams = {}): Promise<McpToolResult> {
  try {
    logger.info('Connection test requested', params.detailed ? 'with detailed output' : '');
    
    const serverContext = getServerContext();
    const testResult = await serverContext.confluenceApi.testConnection();
    
    let result = `🔗 Confluence API Connection Test\n\n`;
    
    if (testResult.success) {
      result += `✅ Status: ${testResult.message}\n`;
      
      if (params.detailed && testResult.details) {
        result += `\n📋 Connection Details:\n`;
        result += `• User: ${testResult.details.user}\n`;
        result += `• Account ID: ${testResult.details.accountId}\n`;
        result += `• Base URL: ${testResult.details.baseUrl}\n`;
        result += `• SSL Verification: ${serverContext.config.verifySSL}\n`;
      }
    } else {
      result += `❌ Status: ${testResult.message}\n`;
      
      if (testResult.details) {
        result += `\n🚨 Error Details:\n`;
        if (testResult.details.status) {
          result += `• HTTP Status: ${testResult.details.status}\n`;
        }
        result += `• Error: ${testResult.details.error}\n`;
        result += `• Base URL: ${testResult.details.baseUrl}\n`;
      }
      
      result += `\n💡 Troubleshooting:\n`;
      result += `• Check your CONFLUENCE_BASE_URL in .env\n`;
      result += `• Verify your CONFLUENCE_PERSONAL_ACCESS_TOKEN\n`;
      result += `• Ensure token has proper permissions\n`;
      result += `• Check network connectivity and SSL settings\n`;
    }

    return {
      content: [{
        type: 'text',
        text: result
      }],
      isError: !testResult.success
    };

  } catch (error) {
    logger.error('Connection test failed:', error);
    return {
      content: [{
        type: 'text',
        text: `❌ Connection test failed: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}