/**
 * Simple logging utility for the MCP server
 */

export interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
}

class SimpleLogger implements Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  info(message: string, ...args: any[]): void {
    console.error(`[${this.getTimestamp()}] INFO: ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[${this.getTimestamp()}] ERROR: ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.DEBUG === 'true') {
      console.error(`[${this.getTimestamp()}] DEBUG: ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    console.error(`[${this.getTimestamp()}] WARN: ${message}`, ...args);
  }
}

export const logger = new SimpleLogger();