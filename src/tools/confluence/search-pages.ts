import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ConfluenceDataCenterApiClient } from '../../utils/confluence-api.js';
import { handleConfluenceError } from '../../utils/error-handler.js';

export const searchPagesTool: Tool = {
  name: 'searchPages',
  description: 'Universal content discovery with CQL queries. Uses /rest/api/content/search endpoint for advanced CQL filtering.',
  inputSchema: {
    type: 'object',
    properties: {
      cqlQuery: {
        type: 'string',
        description: 'CQL query for advanced search (e.g., "type=page AND space.key=\\"DOCS\\" AND title~\\"API\\""). If not provided, will use basic parameters.',
      },
      spaceKey: {
        type: 'string',
        description: 'Space key to search within (used for fallback or simple search)'
      },
      title: {
        type: 'string',
        description: 'Title pattern to search for (used for fallback API)'
      },
      start: {
        type: 'number',
        description: 'Starting index for pagination (default: 0)',
        default: 0
      },
      limit: {
        type: 'number',
        description: 'Number of results per page (default: 25, max: 200)',
        default: 25
      },
      expand: {
        type: 'array',
        description: 'Expansion options for comprehensive data retrieval',
        items: {
          type: 'string',
          enum: ['space', 'version', 'ancestors', 'body.storage']
        },
        default: ['space', 'version', 'ancestors']
      }
    },
    additionalProperties: false
  }
};

export async function executeSearchPages(
  params: {
    cqlQuery?: string;
    spaceKey?: string;
    title?: string;
    start?: number;
    limit?: number;
    expand?: string[];
  },
  client: ConfluenceDataCenterApiClient
): Promise<any> {
  try {
    const start = params.start || 0;
    const limit = Math.min(params.limit || 25, 200);
    const expandParams = params.expand || ['space', 'version', 'ancestors'];
    const expandQuery = expandParams.join(',');

    let response;
    
    // Try CQL search first if CQL query is provided per tool reference section 2.1
    if (params.cqlQuery) {
      try {
        const cqlEndpoint = `/content/search?cql=${encodeURIComponent(params.cqlQuery)}&start=${start}&limit=${limit}&expand=${expandQuery}`;
        response = await client.get(cqlEndpoint);
      } catch (cqlError: any) {
        // If CQL fails, fall back to content API per reference
        if (cqlError.response?.status === 400 || cqlError.response?.status === 403) {
          console.warn('CQL search failed, falling back to content API:', cqlError.message);
          response = await executeContentAPISearch(params, client, start, limit, expandQuery);
        } else {
          throw cqlError;
        }
      }
    } else {
      // Use content API directly if no CQL query provided
      response = await executeContentAPISearch(params, client, start, limit, expandQuery);
    }

    // Return response structure per tool reference section 2.1
    return {
      success: true,
      results: response.results?.map((page: any) => ({
        id: page.id,
        type: page.type,
        title: page.title,
        space: {
          id: page.space?.id,
          key: page.space?.key,
          name: page.space?.name,
          _links: page.space?._links
        },
        version: {
          number: page.version?.number,
          when: page.version?.when,
          by: {
            type: page.version?.by?.type,
            accountId: page.version?.by?.accountId || page.version?.by?.username,
            displayName: page.version?.by?.displayName
          }
        },
        ancestors: page.ancestors?.map((ancestor: any) => ({
          id: ancestor.id,
          title: ancestor.title
        })) || [],
        _links: {
          webui: page._links?.webui,
          self: page._links?.self
        }
      })) || [],
      pagination: {
        start: response.start || start,
        limit: response.limit || limit,
        totalSize: response.totalSize || response.size || 0
      },
      _links: {
        next: response._links?.next
      }
    };
  } catch (error: any) {
    // Enhanced error handling per tool reference
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Check Personal Access Token.');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Insufficient permissions for search operation. Check search permissions.');
    }
    
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      if (errorData?.message?.includes('CQL')) {
        throw new Error(`Invalid CQL query: ${params.cqlQuery}. Check CQL syntax and try again.`);
      }
      throw new Error(`Invalid search request: ${errorData?.message || 'Bad request'}`);
    }

    throw handleConfluenceError(error, 'search pages');
  }
}

// Fallback content API search per tool reference
async function executeContentAPISearch(
  params: {
    spaceKey?: string;
    title?: string;
  },
  client: ConfluenceDataCenterApiClient,
  start: number,
  limit: number,
  expandQuery: string
): Promise<any> {
  let contentEndpoint = `/content?type=page&start=${start}&limit=${limit}&expand=${expandQuery}`;
  
  // Add space key filter if provided
  if (params.spaceKey) {
    contentEndpoint += `&spaceKey=${params.spaceKey}`;
  }
  
  // Add title filter if provided
  if (params.title) {
    contentEndpoint += `&title=${encodeURIComponent(params.title)}`;
  }
  
  return await client.get(contentEndpoint);
}