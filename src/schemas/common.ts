/**
 * Common type definitions shared across tools
 */

import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export interface PaginationOptions {
  start?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  start: number;
  limit: number;
  size: number;
}

// Re-export MCP types for convenience
export type McpToolResult = CallToolResult;