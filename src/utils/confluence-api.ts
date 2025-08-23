/**
 * Confluence Data Center API Client
 * Handles authentication and HTTP requests to Confluence Data Center REST API
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import https from 'https';
import { logger } from './logger.js';

export interface ConfluenceDataCenterConfig {
  baseUrl: string;
  personalAccessToken: string;
  verifySSL: boolean;
}

export class ConfluenceDataCenterApiClient {
  private httpClient: AxiosInstance;
  private config: ConfluenceDataCenterConfig;

  constructor(config: ConfluenceDataCenterConfig) {
    this.config = config;
    
    // Normalize base URL - ensure it has /confluence context path if needed
    const normalizedBaseUrl = this.normalizeBaseUrl(config.baseUrl);
    
    logger.debug(`Initializing API client for: ${normalizedBaseUrl}`);
    logger.debug(`SSL verification: ${config.verifySSL}`);
    
    this.httpClient = axios.create({
      baseURL: normalizedBaseUrl,
      timeout: 30000, // 30 second timeout
      headers: {
        'Authorization': `Bearer ${config.personalAccessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'confluence-dc-mcp-server/1.0.0'
      },
      // Handle SSL certificate verification
      httpsAgent: new https.Agent({
        rejectUnauthorized: config.verifySSL
      })
    });

    // Add request/response interceptors for logging
    this.setupInterceptors();
  }

  /**
   * Normalize base URL to include REST API path
   */
  private normalizeBaseUrl(baseUrl: string): string {
    // Remove trailing slash
    let normalized = baseUrl.replace(/\/$/, '');
    
    // Add /confluence if not present (common Data Center deployment pattern)
    if (!normalized.includes('/confluence')) {
      normalized += '/confluence';
    }
    
    // Add REST API path
    if (!normalized.endsWith('/rest/api')) {
      normalized += '/rest/api';
    }
    
    return normalized;
  }

  /**
   * Setup request/response logging interceptors
   */
  private setupInterceptors(): void {
    this.httpClient.interceptors.request.use(
      (config) => {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.httpClient.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.statusText} (${response.data?.results?.length || 'N/A'} results)`);
        return response;
      },
      (error) => {
        const status = error.response?.status || 'No status';
        const url = error.config?.url || 'Unknown URL';
        const method = error.config?.method?.toUpperCase() || 'Unknown method';
        
        logger.error(`API Error: ${method} ${url} - ${status}`);
        
        if (error.response?.data) {
          logger.debug('API Error Details:', error.response.data);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Test API connection and authentication
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      logger.info('Testing Confluence Data Center API connection...');
      
      // Try to fetch current user info to verify authentication
      const response = await this.httpClient.get('/user/current');
      
      const userInfo = response.data;
      logger.info(`Connection successful! Authenticated as: ${userInfo.displayName} (${userInfo.accountId})`);
      
      return {
        success: true,
        message: `Successfully connected to Confluence as ${userInfo.displayName}`,
        details: {
          user: userInfo.displayName,
          accountId: userInfo.accountId,
          baseUrl: this.config.baseUrl
        }
      };
      
    } catch (error: any) {
      logger.error('Connection test failed:', error.message);
      
      const status = error.response?.status;
      let message = 'Connection failed';
      
      switch (status) {
        case 401:
          message = 'Authentication failed - check your Personal Access Token';
          break;
        case 403:
          message = 'Access denied - check token permissions';
          break;
        case 404:
          message = 'API endpoint not found - check base URL and Confluence version';
          break;
        case undefined:
          message = `Network error: ${error.message}`;
          break;
        default:
          message = `HTTP ${status}: ${error.response?.statusText || error.message}`;
      }
      
      return {
        success: false,
        message,
        details: {
          status,
          error: error.message,
          baseUrl: this.config.baseUrl
        }
      };
    }
  }

  /**
   * Make a GET request to the Confluence API
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.httpClient.get(endpoint, { params });
    return response.data;
  }

  /**
   * Make a POST request to the Confluence API
   */
  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpClient.post(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a PUT request to the Confluence API
   */
  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpClient.put(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request to the Confluence API  
   */
  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.httpClient.delete(endpoint, config);
    return response.data;
  }

  /**
   * Get API client configuration (for debugging)
   */
  getConfig(): ConfluenceDataCenterConfig {
    return {
      baseUrl: this.config.baseUrl,
      personalAccessToken: '[REDACTED]', // Never expose the actual token
      verifySSL: this.config.verifySSL
    };
  }
}