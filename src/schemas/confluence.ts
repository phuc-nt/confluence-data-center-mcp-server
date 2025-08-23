/**
 * Confluence Data Center type definitions
 * Basic types - will be expanded as tools are implemented
 */

export interface ConfluencePage {
  id: string;
  title: string;
  status: 'current' | 'trashed' | 'deleted';
  version: {
    number: number;
    when: string;
    by: {
      displayName: string;
      accountId: string;
    };
  };
}

export interface ConfluenceSpace {
  key: string;
  name: string;
  description: {
    plain: {
      value: string;
    };
  };
  type: 'global' | 'personal';
}

// Additional types will be added as tools are implemented