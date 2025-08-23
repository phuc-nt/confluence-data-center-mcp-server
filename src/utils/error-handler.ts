/**
 * Error handling utilities for Confluence API interactions
 */

import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { AxiosError } from 'axios';

export interface ConfluenceApiError {
  message: string;
  statusCode?: number;
  confluenceErrorCode?: string;
  details?: any;
}

/**
 * Convert various error types to MCP-compatible errors
 */
export function handleConfluenceError(error: unknown, operation: string): McpError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const confluenceError = error.response?.data;

    switch (status) {
      case 401:
        return new McpError(
          ErrorCode.InvalidRequest,
          `Authentication failed for ${operation}. Check your Personal Access Token.`
        );
      case 403:
        return new McpError(
          ErrorCode.InvalidRequest,
          `Access denied for ${operation}. Check permissions for your Personal Access Token.`
        );
      case 404:
        return new McpError(
          ErrorCode.InvalidRequest,
          `Resource not found for ${operation}. Check if the page, space, or API endpoint exists.`
        );
      case 400:
        return new McpError(
          ErrorCode.InvalidRequest,
          `Invalid request for ${operation}: ${confluenceError?.message || error.message}`
        );
      case 429:
        return new McpError(
          ErrorCode.InternalError,
          `Rate limit exceeded for ${operation}. Please retry later.`
        );
      case 500:
      case 502:
      case 503:
        return new McpError(
          ErrorCode.InternalError,
          `Confluence server error during ${operation}. Please try again later.`
        );
      default:
        return new McpError(
          ErrorCode.InternalError,
          `HTTP ${status} error during ${operation}: ${error.message}`
        );
    }
  }

  if (error instanceof Error) {
    return new McpError(
      ErrorCode.InternalError,
      `Error during ${operation}: ${error.message}`
    );
  }

  return new McpError(
    ErrorCode.InternalError,
    `Unknown error during ${operation}: ${String(error)}`
  );
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): void {
  const required = [
    'CONFLUENCE_BASE_URL',
    'CONFLUENCE_PERSONAL_ACCESS_TOKEN'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate URL format
  const baseUrl = process.env.CONFLUENCE_BASE_URL!;
  try {
    new URL(baseUrl);
  } catch {
    throw new Error(`Invalid CONFLUENCE_BASE_URL format: ${baseUrl}`);
  }
}