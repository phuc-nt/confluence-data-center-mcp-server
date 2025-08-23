# Confluence Data Center Tools Complete Reference - Tool-Only Architecture

This document provides a comprehensive list of all Confluence Data Center functionality as tools for a "tool-only" architecture. It covers the REST API v1 differences from Cloud and includes Data Center specific features.

## Overview

All Confluence Data Center functionality is represented as tools that can be called by AI agents. Each tool includes:
- **Purpose**: What the tool does
- **Input Parameters**: Required and optional parameters  
- **Confluence API**: Actual REST API endpoint(s) used (v1)
- **Output Format**: Structure of returned data
- **Key Differences**: How it differs from Cloud version

## Key Differences from Cloud

| Aspect | Cloud | Data Center |
|--------|-------|-------------|
| **API Version** | `/api/v2/` | `/rest/api/` (v1) |
| **Base URL** | `https://yoursite.atlassian.net` | `http://host:port/confluence` |
| **Pagination** | Cursor-based | Offset-based (start/limit) |
| **Space Identifier** | Numeric spaceId | String spaceKey |
| **Authentication** | API Token + OAuth | Basic Auth + Personal Access Tokens |
| **Expand Parameters** | Limited | Extensive expand support |

---

## SPACE TOOLS

### 1. getSpaces
**Purpose**: Retrieve list of all Confluence spaces

**Input Parameters**:
```typescript
{
  start?: number;         // Starting index for pagination (default: 0)
  limit?: number;         // Number of results (default: 25, max: 200)
  spaceKey?: string;      // Filter by specific space key
  type?: string;          // Filter by space type (global, personal)
  status?: string;        // Filter by status (current, archived)
  expand?: string;        // Comma-separated: description,icon,metadata,operations,permissions
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/space`
- **Query Parameters**: `start`, `limit`, `spaceKey`, `type`, `status`, `expand`
- **Pagination**: Offset-based with start/limit

**Output Format**:
```json
{
  "success": true,
  "results": [
    {
      "id": 123456,
      "key": "DEV",
      "name": "Development Space",
      "type": "global",
      "status": "current",
      "description": {
        "plain": {
          "value": "Development team space",
          "representation": "plain"
        }
      },
      "_links": {
        "webui": "/confluence/display/DEV",
        "self": "http://host:port/confluence/rest/api/space/DEV"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1,
  "_links": {
    "next": "/rest/api/space?start=25&limit=25",
    "base": "http://host:port/confluence",
    "context": "/confluence"
  }
}
```

---

### 2. getSpaceDetails
**Purpose**: Get detailed information for a specific space

**Input Parameters**:
```typescript
{
  spaceKey: string;       // Required: Space key (e.g., "DEV", "PROJ")
  expand?: string;        // Optional: description,icon,metadata,operations,permissions
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/space/{spaceKey}`
- **URL Parameters**: `spaceKey` (string key, not numeric ID)
- **Expand Options**: Get additional space information

**Output Format**:
```json
{
  "success": true,
  "space": {
    "id": 123456,
    "key": "DEV", 
    "name": "Development Space",
    "type": "global",
    "status": "current",
    "description": {
      "plain": {
        "value": "Development team space",
        "representation": "plain"
      },
      "view": {
        "value": "<p>Development team space</p>",
        "representation": "view"
      }
    },
    "metadata": {
      "labels": {
        "results": [],
        "start": 0,
        "limit": 200,
        "size": 0
      }
    },
    "_links": {
      "webui": "/confluence/display/DEV",
      "self": "http://host:port/confluence/rest/api/space/DEV"
    }
  }
}
```

---

### 3. getSpacePages  
**Purpose**: List all pages in a specific space

**Input Parameters**:
```typescript
{
  spaceKey: string;       // Required: Space key
  start?: number;         // Starting index (default: 0)
  limit?: number;         // Number of results (default: 25)
  expand?: string;        // Optional: space,body.storage,version,ancestors
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content`
- **Query Parameters**: `spaceKey={key}&type=page&start={start}&limit={limit}`
- **Filter**: Results filtered by spaceKey and type=page

**Output Format**:
```json
{
  "success": true,
  "spaceKey": "DEV",
  "pages": [
    {
      "id": "98765",
      "type": "page",
      "status": "current",
      "title": "Development Guidelines",
      "space": {
        "id": 123456,
        "key": "DEV",
        "name": "Development Space"
      },
      "version": {
        "by": {
          "type": "known",
          "username": "admin",
          "displayName": "Administrator"
        },
        "when": "2023-01-01T00:00:00.000Z",
        "number": 1
      },
      "_links": {
        "webui": "/confluence/pages/viewpage.action?pageId=98765",
        "self": "http://host:port/confluence/rest/api/content/98765"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1
}
```

---

## PAGE TOOLS

### 4. getPages
**Purpose**: Search and filter pages across spaces

**Input Parameters**:
```typescript
{
  title?: string;         // Filter by page title  
  spaceKey?: string;      // Filter by space key
  type?: string;          // Content type: page, blogpost (default: page)
  status?: string;        // Filter by status: current, trashed, archived
  start?: number;         // Starting index (default: 0)
  limit?: number;         // Number of results (default: 25)
  expand?: string;        // space,body.storage,version,ancestors,children.page
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content`
- **Query Parameters**: Dynamic based on filters provided
- **Expand**: Critical for getting complete data in single call

**Output Format**:
```json
{
  "success": true,
  "pages": [
    {
      "id": "98765",
      "type": "page", 
      "status": "current",
      "title": "API Documentation",
      "space": {
        "id": 123456,
        "key": "DEV",
        "name": "Development Space",
        "_links": {
          "webui": "/confluence/display/DEV"
        }
      },
      "version": {
        "by": {
          "type": "known",
          "username": "john.doe",
          "displayName": "John Doe"
        },
        "when": "2023-01-15T10:30:00.000Z", 
        "number": 3,
        "message": "Updated API examples"
      },
      "_links": {
        "webui": "/confluence/pages/viewpage.action?pageId=98765",
        "edit": "/confluence/pages/editpage.action?pageId=98765",
        "self": "http://host:port/confluence/rest/api/content/98765"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1
}
```

---

### 5. getPageDetails
**Purpose**: Get complete page information including content body

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID
  expand?: string;        // body.storage,version,space,ancestors,children.page
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}?expand=body.storage,version,space,ancestors`
- **Single Call**: Content body included via expand parameter
- **Comprehensive**: All page data in one response

**Output Format**:
```json
{
  "success": true,
  "page": {
    "id": "98765",
    "type": "page",
    "status": "current", 
    "title": "Complete API Guide",
    "space": {
      "id": 123456,
      "key": "DEV",
      "name": "Development Space"
    },
    "body": {
      "storage": {
        "value": "<p>This is the complete API documentation...</p><ac:structured-macro ac:name='info'><ac:rich-text-body>Important note</ac:rich-text-body></ac:structured-macro>",
        "representation": "storage"
      },
      "view": {
        "value": "<p>This is the complete API documentation...</p>",
        "representation": "view"
      }
    },
    "version": {
      "by": {
        "type": "known",
        "username": "jane.smith",
        "displayName": "Jane Smith"
      },
      "when": "2023-01-20T14:45:00.000Z",
      "number": 5,
      "message": "Added new endpoint documentation"
    },
    "ancestors": [
      {
        "id": "12345",
        "type": "page", 
        "status": "current",
        "title": "API Documentation Root"
      }
    ],
    "_links": {
      "webui": "/confluence/pages/viewpage.action?pageId=98765",
      "self": "http://host:port/confluence/rest/api/content/98765"
    }
  }
}
```

---

### 6. getPageChildren
**Purpose**: Get all child pages of a specific page

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Parent page ID
  start?: number;         // Starting index (default: 0)
  limit?: number;         // Number of results (default: 25)
  expand?: string;        // page,version,space for detailed child info
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}/child?expand=page`
- **Child Types**: page, comment, attachment
- **Nested Structure**: Results contain page objects

**Output Format**:
```json
{
  "success": true,
  "parentPageId": "98765",
  "children": {
    "page": {
      "results": [
        {
          "id": "11111",
          "type": "page",
          "status": "current",
          "title": "Child Page 1",
          "space": {
            "key": "DEV"
          },
          "version": {
            "number": 1,
            "when": "2023-01-02T00:00:00.000Z"
          },
          "_links": {
            "webui": "/confluence/pages/viewpage.action?pageId=11111"
          }
        }
      ],
      "start": 0,
      "limit": 25,
      "size": 1
    }
  }
}
```

---

### 7. getPageAncestors
**Purpose**: Get all ancestor pages (parent hierarchy) of a specific page

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}?expand=ancestors`
- **Hierarchy**: Complete ancestor chain from root to immediate parent
- **Embedded**: Ancestors included in expandable section

**Output Format**:
```json
{
  "success": true,
  "pageId": "98765",
  "ancestors": [
    {
      "id": "11111",
      "type": "page",
      "status": "current", 
      "title": "Documentation Root",
      "space": {
        "key": "DEV"
      },
      "_links": {
        "webui": "/confluence/pages/viewpage.action?pageId=11111"
      }
    },
    {
      "id": "22222",
      "type": "page", 
      "status": "current",
      "title": "API Section",
      "space": {
        "key": "DEV"
      },
      "_links": {
        "webui": "/confluence/pages/viewpage.action?pageId=22222"
      }
    }
  ],
  "ancestorCount": 2
}
```

---

### 8. getPageAttachments
**Purpose**: List all attachments for a specific page

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID
  start?: number;         // Starting index (default: 0)
  limit?: number;         // Number of results (default: 25)
  expand?: string;        // version,space for additional attachment info
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}/child/attachment`
- **Child Type**: attachment
- **Download URLs**: Included in response links

**Output Format**:
```json
{
  "success": true,
  "pageId": "98765",
  "attachments": [
    {
      "id": "att123456",
      "type": "attachment",
      "status": "current",
      "title": "api-spec.pdf",
      "metadata": {
        "mediaType": "application/pdf",
        "fileSize": 1048576,
        "comment": "Latest API specification"
      },
      "version": {
        "by": {
          "type": "known",
          "username": "admin",
          "displayName": "Administrator"
        },
        "when": "2023-01-01T00:00:00.000Z",
        "number": 1
      },
      "_links": {
        "webui": "/confluence/pages/viewpage.action?pageId=98765&preview=/confluence/download/attachments/98765/api-spec.pdf",
        "download": "/confluence/download/attachments/98765/api-spec.pdf",
        "self": "http://host:port/confluence/rest/api/content/att123456"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1
}
```

---

### 9. getPageVersions
**Purpose**: Get version history of a specific page

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID
  start?: number;         // Starting index (default: 0)
  limit?: number;         // Number of results (default: 25)
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}/history`
- **Ordering**: Latest versions first
- **Complete History**: All versions with author and change info

**Output Format**:
```json
{
  "success": true,
  "pageId": "98765",
  "versions": [
    {
      "by": {
        "type": "known",
        "username": "jane.smith",
        "displayName": "Jane Smith"
      },
      "when": "2023-01-20T14:45:00.000Z",
      "number": 5,
      "message": "Added troubleshooting section",
      "minorEdit": false,
      "_links": {
        "self": "http://host:port/confluence/rest/api/content/98765?version=5"
      }
    },
    {
      "by": {
        "type": "known", 
        "username": "john.doe",
        "displayName": "John Doe"
      },
      "when": "2023-01-15T10:30:00.000Z",
      "number": 4,
      "message": "Fixed formatting",
      "minorEdit": true
    }
  ],
  "latest": true,
  "start": 0,
  "limit": 25,
  "size": 2
}
```

---

### 10. getPageLabels
**Purpose**: Get all labels/tags assigned to a specific page

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID
  start?: number;         // Starting index (default: 0)  
  limit?: number;         // Number of results (default: 200)
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}/label`
- **Label Types**: Global labels and space-specific labels
- **Metadata**: Label creation info included

**Output Format**:
```json
{
  "success": true,
  "pageId": "98765",
  "labels": [
    {
      "prefix": "global",
      "name": "api",
      "id": "label123",
      "_links": {
        "self": "http://host:port/confluence/rest/api/label/label123"
      }
    },
    {
      "prefix": "my",
      "name": "documentation", 
      "id": "label456"
    }
  ],
  "start": 0,
  "limit": 200,
  "size": 2
}
```

---

## COMMENT TOOLS

### 11. getPageComments
**Purpose**: Get all comments for a specific page

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID
  start?: number;         // Starting index (default: 0)
  limit?: number;         // Number of results (default: 25)
  expand?: string;        // body.storage,version for complete comment data
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}/child/comment?expand=body.storage,version`
- **Comment Types**: Footer comments (inline comments embedded in content)
- **Content Body**: Comments have storage and view representations

**Output Format**:
```json
{
  "success": true,
  "pageId": "98765",
  "comments": [
    {
      "id": "comment123",
      "type": "comment",
      "status": "current",
      "title": "Re: API Documentation",
      "body": {
        "storage": {
          "value": "<p>Great documentation! Could you add more examples?</p>",
          "representation": "storage"
        },
        "view": {
          "value": "<p>Great documentation! Could you add more examples?</p>",
          "representation": "view"  
        }
      },
      "version": {
        "by": {
          "type": "known",
          "username": "reviewer",
          "displayName": "Code Reviewer"  
        },
        "when": "2023-01-21T09:15:00.000Z",
        "number": 1
      },
      "_links": {
        "webui": "/confluence/pages/viewpage.action?pageId=98765&focusedCommentId=comment123",
        "self": "http://host:port/confluence/rest/api/content/comment123"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1
}
```

---

## CONTENT CREATION & MODIFICATION TOOLS

### 12. createPage  
**Purpose**: Create a new Confluence page

**Input Parameters**:
```typescript
{
  spaceKey: string;       // Required: Space key (e.g., "DEV")
  title: string;          // Required: Page title
  content: string;        // Required: Content in Confluence storage format
  parentId?: string;      // Optional: Parent page ID for hierarchy
  representation?: string; // Optional: "storage" (default), "wiki"
}
```

**Confluence API**:
- **Endpoint**: `POST /rest/api/content`
- **Content-Type**: `application/json`  
- **Body Structure**: Data Center content creation format

**API Request Body**:
```json
{
  "type": "page",
  "title": "New API Endpoint",
  "space": {
    "key": "DEV"
  },
  "ancestors": [
    {
      "id": "98765"
    }
  ],
  "body": {
    "storage": {
      "value": "<p>This page documents the new API endpoint</p><ac:structured-macro ac:name='code'><ac:parameter ac:name='language'>json</ac:parameter><ac:plain-text-body><![CDATA[{\"example\": \"data\"}]]></ac:plain-text-body></ac:structured-macro>",
      "representation": "storage"
    }
  }
}
```

**Output Format**:
```json
{
  "success": true,
  "page": {
    "id": "111222",
    "type": "page",
    "status": "current",
    "title": "New API Endpoint", 
    "space": {
      "id": 123456,
      "key": "DEV",
      "name": "Development Space"
    },
    "version": {
      "by": {
        "type": "known",
        "username": "current.user", 
        "displayName": "Current User"
      },
      "when": "2023-01-25T10:00:00.000Z",
      "number": 1,
      "message": "Initial version"
    },
    "_links": {
      "webui": "/confluence/pages/viewpage.action?pageId=111222",
      "edit": "/confluence/pages/editpage.action?pageId=111222",
      "self": "http://host:port/confluence/rest/api/content/111222"
    }
  }
}
```

**Content Format Requirements**:
- Must use Confluence storage format (XML-like HTML)
- Macros: `<ac:structured-macro>`, `<ac:parameter>`, `<ac:plain-text-body>`
- CDATA sections for code blocks: `<![CDATA[...]]>`
- Standard HTML tags: `<p>`, `<h1>-<h6>`, `<ul>`, `<ol>`, `<strong>`, `<em>`

---

### 13. updatePage
**Purpose**: Update existing page content and title  

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID to update
  title?: string;         // Optional: New page title
  content?: string;       // Optional: New content in storage format  
  version: number;        // Required: Current version number (for conflict resolution)
  versionMessage?: string;// Optional: Version comment
}
```

**Confluence API**:
- **Endpoint**: `PUT /rest/api/content/{id}`
- **Version Check**: Required for optimistic locking
- **Full Object**: Must provide complete content object

**API Request Body**:
```json
{
  "id": "98765",
  "type": "page", 
  "title": "Updated API Documentation",
  "space": {
    "key": "DEV"
  },
  "body": {
    "storage": {
      "value": "<p>Updated documentation with new examples...</p>",
      "representation": "storage"
    }
  },
  "version": {
    "number": 6,
    "message": "Added authentication examples"
  }
}
```

**Output Format**:
```json
{
  "success": true,
  "page": {
    "id": "98765",
    "type": "page",
    "status": "current",
    "title": "Updated API Documentation",
    "version": {
      "by": {
        "type": "known",
        "username": "current.user",
        "displayName": "Current User"
      },
      "when": "2023-01-25T11:30:00.000Z", 
      "number": 7,
      "message": "Added authentication examples"
    },
    "_links": {
      "webui": "/confluence/pages/viewpage.action?pageId=98765",
      "self": "http://host:port/confluence/rest/api/content/98765"
    }
  }
}
```

---

### 14. deletePage
**Purpose**: Delete a Confluence page

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID to delete
  status?: string;        // Optional: "trashed" for soft delete (default: permanent)
}
```

**Confluence API**:
- **Endpoint**: `DELETE /rest/api/content/{id}`
- **Query Parameters**: `status=trashed` for soft delete
- **Soft Delete**: Move to trash instead of permanent deletion

**Output Format**:
```json
{
  "success": true,
  "pageId": "98765",
  "action": "deleted",
  "softDelete": true,
  "status": "trashed",
  "message": "Page moved to trash successfully",
  "deletedAt": "2023-01-25T12:00:00.000Z"
}
```

---

## COMMENT MANAGEMENT TOOLS

### 15. addComment
**Purpose**: Add a comment to a page

**Input Parameters**:
```typescript
{
  pageId: string;         // Required: Page ID to comment on
  content: string;        // Required: Comment content in storage format
  representation?: string; // Optional: "storage" (default)
}
```

**Confluence API**:
- **Endpoint**: `POST /rest/api/content`
- **Content-Type**: `application/json`
- **Comment Type**: Create content with type="comment"

**API Request Body**:
```json
{
  "type": "comment",
  "container": {
    "id": "98765",
    "type": "page"
  },
  "body": {
    "storage": {
      "value": "<p>This is a helpful comment with additional context.</p>",
      "representation": "storage"
    }
  }
}
```

**Output Format**:
```json
{
  "success": true,
  "comment": {
    "id": "comment789",
    "type": "comment", 
    "status": "current",
    "title": "Re: API Documentation",
    "body": {
      "storage": {
        "value": "<p>This is a helpful comment with additional context.</p>",
        "representation": "storage"
      }
    },
    "version": {
      "by": {
        "type": "known",
        "username": "current.user",
        "displayName": "Current User"
      },
      "when": "2023-01-25T13:00:00.000Z",
      "number": 1
    },
    "_links": {
      "webui": "/confluence/pages/viewpage.action?pageId=98765&focusedCommentId=comment789",
      "self": "http://host:port/confluence/rest/api/content/comment789"
    }
  }
}
```

---

### 16. updateComment
**Purpose**: Update an existing comment

**Input Parameters**:
```typescript
{
  commentId: string;      // Required: Comment ID to update
  content: string;        // Required: New comment content
  version: number;        // Required: Current comment version
  versionMessage?: string;// Optional: Version message
}
```

**Confluence API**:
- **Endpoint**: `PUT /rest/api/content/{commentId}`
- **Version Check**: Required for conflict resolution
- **Full Object**: Must provide complete comment object

**Output Format**:
```json
{
  "success": true,
  "comment": {
    "id": "comment789",
    "type": "comment",
    "status": "current",
    "body": {
      "storage": {
        "value": "<p>Updated comment with more detailed information.</p>",
        "representation": "storage"
      }
    },
    "version": {
      "number": 2,
      "when": "2023-01-25T13:30:00.000Z",
      "message": "Clarified the explanation"
    }
  }
}
```

---

### 17. deleteComment  
**Purpose**: Delete a comment

**Input Parameters**:
```typescript
{
  commentId: string;      // Required: Comment ID to delete
}
```

**Confluence API**:
- **Endpoint**: `DELETE /rest/api/content/{commentId}`
- **Authorization**: User must own comment or have admin rights
- **Permanent**: Comments are permanently deleted

**Output Format**:
```json
{
  "success": true,
  "commentId": "comment789",
  "message": "Comment deleted successfully",
  "deletedAt": "2023-01-25T14:00:00.000Z"
}
```

---

## DATA CENTER EXCLUSIVE TOOLS

### 18. getContentProperties
**Purpose**: Get custom properties attached to content

**Input Parameters**:
```typescript
{
  contentId: string;      // Required: Page or content ID
  key?: string;           // Optional: Specific property key
  expand?: string;        // Optional: version,space
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}/property` or `GET /rest/api/content/{id}/property/{key}`
- **Custom Metadata**: Store custom key-value data
- **Data Center Only**: Not available in Cloud

**Output Format**:
```json
{
  "success": true,
  "contentId": "98765",
  "properties": [
    {
      "key": "review-status",
      "value": {
        "status": "approved",
        "reviewedBy": "jane.doe",
        "reviewDate": "2023-01-20"
      },
      "version": {
        "number": 1,
        "when": "2023-01-20T10:00:00.000Z"
      }
    }
  ]
}
```

---

### 19. setContentProperty
**Purpose**: Set custom property on content

**Input Parameters**:  
```typescript
{
  contentId: string;      // Required: Page or content ID
  key: string;            // Required: Property key
  value: any;             // Required: Property value (object/string/number)
}
```

**Confluence API**:
- **Endpoint**: `POST /rest/api/content/{id}/property` or `PUT /rest/api/content/{id}/property/{key}`
- **Custom Data**: Store structured metadata
- **Versioned**: Properties are versioned

---

### 20. getSpaceProperties  
**Purpose**: Get custom properties attached to space

**Input Parameters**:
```typescript  
{
  spaceKey: string;       // Required: Space key
  key?: string;           // Optional: Specific property key
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/space/{spaceKey}/property`
- **Space Metadata**: Custom space-level data storage

---

### 21. searchContent
**Purpose**: Advanced search using CQL (Confluence Query Language)

**Input Parameters**:
```typescript
{
  cql: string;            // Required: CQL query string
  start?: number;         // Starting index (default: 0)
  limit?: number;         // Number of results (default: 25)
  expand?: string;        // space,body.storage,version
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/search?cql={query}`
- **CQL Examples**: 
  - `space="DEV" AND type=page`
  - `title~"API" AND label="documentation"`
  - `creator="john.doe" AND created >= "2023-01-01"`

**Output Format**:
```json
{
  "success": true,
  "cql": "space=\"DEV\" AND type=page AND label=\"api\"",
  "results": [
    {
      "id": "98765",
      "type": "page",
      "status": "current", 
      "title": "API Documentation",
      "space": {
        "key": "DEV",
        "name": "Development Space"
      },
      "version": {
        "number": 5
      },
      "_links": {
        "webui": "/confluence/pages/viewpage.action?pageId=98765"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1,
  "totalSize": 1
}
```

---

### 22. getContentRestrictions
**Purpose**: Get access restrictions for content

**Input Parameters**:
```typescript
{
  contentId: string;      // Required: Content ID
  operationKey?: string;  // Optional: read, update (default: all)
  expand?: string;        // user,group for detailed restriction info
}
```

**Confluence API**:
- **Endpoint**: `GET /rest/api/content/{id}/restriction/byOperation/{operationKey}`
- **Permissions**: Page-level access control
- **Operations**: read, update restrictions

---

## AUTHENTICATION & ERROR HANDLING

### Authentication

**Option 1: Basic Authentication (Traditional)**
```
Authorization: Basic base64(username:password)
```
- Use your Confluence username and password
- Simple but requires password sharing

**Option 2: Personal Access Tokens (Recommended - v7.9+)**  
```
Authorization: Bearer {personal_access_token}
```
- Generate from: User Profile → Personal Access Tokens
- More secure, can be revoked
- Scoped permissions

**Option 3: Session-based Authentication**
```
Cookie: JSESSIONID={session_id}
```
- Login via `/rest/auth/1/session`
- Web app integration

### Common Error Responses
```json
{
  "success": false,
  "error": {
    "statusCode": 401,
    "message": "Basic authentication with passwords is deprecated. Use an API token instead.",
    "reason": "Unauthorized"
  }
}
```

### Rate Limits
- **Data Center**: Configurable by administrators
- **Default**: Usually higher than Cloud limits
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- **Recommendation**: Implement exponential backoff

---

## IMPLEMENTATION NOTES

### Key Differences Summary

| Feature | Cloud (v2) | Data Center (v1) |
|---------|------------|------------------|
| **Tools Count** | 17 tools | 22 tools (5 exclusive) |
| **Space ID** | Numeric ID | String key |  
| **Pagination** | Cursor-based | Offset-based |
| **Expand Parameters** | Limited | Extensive |
| **Custom Properties** | ❌ | ✅ |
| **CQL Search** | Basic | Advanced |
| **Content Restrictions** | ❌ | ✅ |

### Data Center Advantages
1. **Content Properties**: Store custom metadata on pages/spaces
2. **Advanced CQL Search**: Powerful query language for complex searches  
3. **Content Restrictions**: Fine-grained permission control
4. **Space Properties**: Custom space-level data storage
5. **REST API Browser**: Built-in API exploration at `/rest/api/`

### Implementation Considerations
1. **Use spaceKey instead of spaceId** for all space operations
2. **Leverage expand parameters** to minimize API calls
3. **Implement offset-based pagination** with start/limit
4. **Utilize CQL for complex searches** instead of basic filtering
5. **Store custom data via properties** rather than in page content

### Content Format Requirements  
- **Storage Format**: Same XML-like HTML as Cloud
- **Macros**: Full support for Confluence macros
- **CDATA**: Use for code blocks: `<![CDATA[code here]]>`
- **Validation**: Content must be well-formed XML
- **Migration**: Storage format compatible between Cloud/Data Center

This comprehensive Data Center tool reference provides all functionality needed for a complete Confluence Data Center integration with tool-only architecture, including exclusive Data Center features not available in Cloud.