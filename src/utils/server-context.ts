/**
 * Server context management for dependency injection
 * Provides configuration and services to tools
 */

import { ConfluenceDataCenterApiClient, ConfluenceDataCenterConfig } from './confluence-api.js';
import { logger } from './logger.js';

export interface ServerContext {
  confluenceApi: ConfluenceDataCenterApiClient;
  config: ConfluenceDataCenterConfig;
}

let serverContext: ServerContext | null = null;

/**
 * Initialize server context with configuration
 */
export function initializeServerContext(): ServerContext {
  try {
    const config: ConfluenceDataCenterConfig = {
      baseUrl: process.env.CONFLUENCE_BASE_URL!,
      personalAccessToken: process.env.CONFLUENCE_PERSONAL_ACCESS_TOKEN!,
      verifySSL: process.env.CONFLUENCE_VERIFY_SSL !== 'false'
    };

    logger.info(`Initializing Confluence API client for: ${config.baseUrl}`);
    logger.debug(`SSL verification: ${config.verifySSL}`);

    const confluenceApi = new ConfluenceDataCenterApiClient(config);

    serverContext = {
      confluenceApi,
      config
    };

    return serverContext;

  } catch (error) {
    logger.error('Failed to initialize server context:', error);
    throw error;
  }
}

/**
 * Get current server context
 */
export function getServerContext(): ServerContext {
  if (!serverContext) {
    throw new Error('Server context not initialized. Call initializeServerContext() first.');
  }
  return serverContext;
}