# **Confluence Data Center MCP Server - Complete Tool Implementation**
> **Enhanced for all workflow scenarios with REST API v1 + Bearer PAT**

## 🔧 **Base Configuration & Authentication**

```typescript
// Single API Architecture - REST v1 Universal
baseURL: `${hostname}/wiki/rest/api`
Authorization: `Bearer ${personalAccessToken}`
Content-Type: `application/json`
Accept: `application/json`
```

***

## 🛠️ **Complete Tool Implementations (11 Tools)**

### **1. Page Management Tools (5 tools)**

#### **1.1 createPage**
**Purpose**: Create new pages with structured content, hierarchical organization  
**Workflow Support**: Documentation creation, meeting notes, project pages, child pages

```http
POST /wiki/rest/api/content
Authorization: Bearer {PAT}
Content-Type: application/json
```

**Enhanced Request Body with all options:**
```json
{
  "type": "page",
  "title": "Page Title",
  "space": {"key": "SPACEKEY"},
  "ancestors": [{"id": "parentPageId"}],  // Optional for child pages
  "body": {
    "storage": {
      "value": "TitleContent with formattingInfo box",
      "representation": "storage"
    }
  }
}
```

**Success Response Structure:**
```json
{
  "id": "123456789",
  "type": "page", 
  "title": "Page Title",
  "space": {
    "id": 98765,
    "key": "SPACEKEY",
    "name": "Space Name"
  },
  "version": {
    "number": 1,
    "by": {
      "type": "known",
      "accountId": "user123",
      "displayName": "John Doe"
    },
    "when": "2025-08-24T22:13:00.000Z",
    "message": ""
  },
  "ancestors": [{"id": "parentPageId"}],
  "_links": {
    "webui": "/pages/123456789",
    "self": "https://hostname/wiki/rest/api/content/123456789"
  }
}
```

***

#### **1.2 getPageContent**
**Purpose**: Complete page data retrieval for content review, version checking, migration  
**Workflow Support**: Content analysis, template extraction, backup operations

```http
GET /wiki/rest/api/content/{pageId}?expand=body.storage,version,space,ancestors,children.page,descendants.comment
Authorization: Bearer {PAT}
```

**Enhanced Parameters:**
- `pageId`: string (required)
- `expand`: Comprehensive expansion options
  - `body.storage` - Full content in storage format
  - `body.view` - Rendered HTML content  
  - `version` - Current version with author info
  - `space` - Space details and permissions
  - `ancestors` - Complete parent hierarchy
  - `children.page` - Direct child pages
  - `descendants.comment` - All comments

**Complete Response Structure:**
```json
{
  "id": "123456789",
  "type": "page",
  "title": "Complete Page Title",
  "space": {
    "id": 98765,
    "key": "SPACEKEY", 
    "name": "Space Name",
    "_links": {"webui": "/spaces/SPACEKEY"}
  },
  "body": {
    "storage": {
      "value": "ContentFull page content...",
      "representation": "storage"
    }
  },
  "version": {
    "number": 5,
    "by": {
      "type": "known",
      "accountId": "user123", 
      "displayName": "Jane Smith"
    },
    "when": "2025-08-24T20:00:00.000Z",
    "message": "Updated implementation section"
  },
  "ancestors": [
    {"id": "111111", "title": "Parent Page"},
    {"id": "222222", "title": "Grandparent Page"}
  ],
  "children": {
    "page": {
      "results": [
        {"id": "333333", "title": "Child Page 1"},
        {"id": "444444", "title": "Child Page 2"}
      ]
    }
  }
}
```

***

#### **1.3 updatePage**
**Purpose**: Content updates with version control, collaborative editing  
**Workflow Support**: Content revisions, title corrections, section additions

```http
PUT /wiki/rest/api/content/{pageId}
Authorization: Bearer {PAT}
Content-Type: application/json
```

**Enhanced Request with Version Control:**
```json
{
  "id": "123456789",
  "type": "page", 
  "title": "Updated Page Title",
  "space": {"key": "SPACEKEY"},
  "body": {
    "storage": {
      "value": "Updated TitleEnhanced content with new sections...",
      "representation": "storage"
    }
  },
  "version": {
    "number": 6,
    "message": "Added implementation examples and fixed typos"
  }
}
```

**Version Conflict Handling:**
```json
// Error Response for version conflicts (409)
{
  "statusCode": 409,
  "message": "Version conflict - page has been updated by another user",
  "data": {
    "authorized": true,
    "valid": true,
    "successful": false,
    "currentVersion": 7
  }
}
```

***

#### **1.4 deletePage**
**Purpose**: Page removal with options for soft/hard delete  
**Workflow Support**: Cleanup, archive, space reorganization

```http
DELETE /wiki/rest/api/content/{pageId}?status=trashed
Authorization: Bearer {PAT}
```

**Delete Options:**
- `status=trashed` - Soft delete (recoverable)
- No status parameter - Permanent delete (admin only)

**Success Response:**
```json
{
  "id": "123456789",
  "status": "trashed",
  "title": "Deleted Page Title", 
  "version": {
    "number": 6,
    "when": "2025-08-24T22:13:00.000Z"
  }
}
```

***

#### **1.5 getSpaces**
**Purpose**: Space discovery with permissions and metadata  
**Workflow Support**: Navigation, permission validation, workspace overview

```http
GET /wiki/rest/api/space?start={start}&limit={limit}&expand=description,homepage,permissions
Authorization: Bearer {PAT}
```

**Enhanced Response with Permissions:**
```json
{
  "results": [
    {
      "id": 98765,
      "key": "DEMO",
      "name": "Demo Space",
      "type": "global",
      "status": "current",
      "description": {
        "plain": {
          "value": "Space description...",
          "representation": "plain"
        }
      },
      "homepage": {
        "id": "555555",
        "title": "Home Page",
        "_links": {"webui": "/pages/555555"}
      },
      "permissions": [
        {
          "subjects": {
            "user": {"results": [{"type": "known", "accountId": "user123"}]}
          },
          "operation": {
            "operation": "read",
            "targetType": "space"
          }
        }
      ],
      "_links": {
        "webui": "/spaces/DEMO",
        "self": "https://hostname/wiki/rest/api/space/DEMO"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1
}
```

***

### **2. Search & Discovery Tools (2 tools)**

#### **2.1 searchPages**
**Purpose**: Universal content discovery with advanced CQL filtering  
**Workflow Support**: Content audit, knowledge discovery, related page identification

```http
GET /wiki/rest/api/content/search?cql={cqlQuery}&start={start}&limit={limit}&expand=space,version,ancestors
Authorization: Bearer {PAT}
```

**Enhanced CQL Query Examples:**
```sql
-- Multi-criteria search
type=page AND (title~"API documentation" OR text~"authentication") AND space.key="DOCS" AND lastModified >= "2024-01-01"

-- Author and date filtering  
type=page AND creator="john.doe" AND created >= startOfWeek() AND space.category="Technical"

-- Content type and label search
type=page AND label in ("important", "review-required") AND contributor in ("jane.smith", "bob.jones")

-- Advanced hierarchical search
type=page AND ancestor="123456" AND title~"implementation" AND lastModified >= "2024-08-01"
```

**Fallback Content API (if CQL restricted):**
```http
GET /wiki/rest/api/content?type=page&spaceKey={spaceKey}&title={title}&start={start}&limit={limit}&expand=space,version
```

**Enhanced Search Response:**
```json
{
  "results": [
    {
      "id": "789012345",
      "type": "page",
      "title": "API Authentication Guide",
      "space": {
        "key": "DOCS",
        "name": "Documentation"
      },
      "version": {
        "number": 3,
        "when": "2025-08-20T15:30:00.000Z",
        "by": {"displayName": "John Doe"}
      },
      "ancestors": [
        {"id": "111111", "title": "API Documentation"}
      ],
      "_links": {
        "webui": "/pages/789012345"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "totalSize": 45,
  "_links": {
    "next": "/rest/api/content/search?cql=...&start=25"
  }
}
```

***

#### **2.2 getPageVersions**
**Purpose**: Complete version history for change tracking and rollback  
**Workflow Support**: Version analysis, rollback preparation, collaboration tracking

```http
GET /wiki/rest/api/content/{pageId}/version?start={start}&limit={limit}
Authorization: Bearer {PAT}
```

**Complete Version Response:**
```json
{
  "results": [
    {
      "by": {
        "type": "known",
        "accountId": "user456",
        "displayName": "Jane Smith",
        "profilePicture": {
          "path": "/profilepictures/user456.png"
        }
      },
      "when": "2025-08-24T20:00:00.000Z",
      "number": 5,
      "message": "Added implementation examples",
      "minorEdit": false,
      "_links": {
        "self": "https://hostname/wiki/rest/api/content/123456789/version/5"
      }
    },
    {
      "by": {
        "type": "known", 
        "accountId": "user123",
        "displayName": "John Doe"
      },
      "when": "2025-08-23T14:30:00.000Z",
      "number": 4,
      "message": "Fixed formatting issues",
      "minorEdit": true
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 2
}
```

***

### **3. Comment Management Tools (4 tools)**

#### **3.1 getPageComments**
**Purpose**: Complete comment retrieval with threading support  
**Workflow Support**: Review collection, discussion analysis, moderation

```http
GET /wiki/rest/api/content/{pageId}/child/comment?start={start}&limit={limit}&expand=body.storage,version,ancestors
Authorization: Bearer {PAT}
```

**Enhanced Comment Response with Threading:**
```json
{
  "results": [
    {
      "id": "comment123456",
      "type": "comment",
      "title": "Re: API Authentication Guide",
      "body": {
        "storage": {
          "value": "Great explanation! Could you add examples for OAuth 2.0?",
          "representation": "storage"
        }
      },
      "version": {
        "number": 1,
        "by": {
          "type": "known",
          "accountId": "user789", 
          "displayName": "Bob Wilson"
        },
        "when": "2025-08-24T16:45:00.000Z"
      },
      "ancestors": [
        {"id": "123456789", "type": "page", "title": "API Authentication Guide"}
      ],
      "children": {
        "comment": {
          "results": [
            {
              "id": "comment789012",
              "title": "Re: Re: API Authentication Guide",
              "body": {
                "storage": {
                  "value": "@Bob Wilson I'll add OAuth examples in the next update.",
                  "representation": "storage"
                }
              }
            }
          ]
        }
      },
      "_links": {
        "webui": "/pages/123456789#comment-comment123456"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1
}
```

***

#### **3.2 addComment**
**Purpose**: Add comments and threaded replies  
**Workflow Support**: Feedback, reviews, discussion participation

```http
POST /wiki/rest/api/content
Authorization: Bearer {PAT}
Content-Type: application/json
```

**Top-level Comment:**
```json
{
  "type": "comment",
  "container": {"id": "123456789"},
  "body": {
    "storage": {
      "value": "Please review the authentication section. @john.doe what do you think about the OAuth flow?",
      "representation": "storage"
    }
  }
}
```

**Threaded Reply:**
```json
{
  "type": "comment",
  "container": {"id": "123456789"},
  "ancestors": [{"id": "comment123456"}],  // Parent comment
  "body": {
    "storage": {
      "value": "@jane.smith The OAuth flow looks good, but we should add error handling examples.",
      "representation": "storage"  
    }
  }
}
```

***

#### **3.3 updateComment**
**Purpose**: Edit comments with version control  
**Workflow Support**: Corrections, context additions, feedback updates

```http
PUT /wiki/rest/api/content/{commentId}  
Authorization: Bearer {PAT}
Content-Type: application/json
```

**Update Request:**
```json
{
  "id": "comment123456",
  "type": "comment",
  "body": {
    "storage": {
      "value": "Updated: Please review the authentication section. I've added specific questions about the OAuth 2.0 implementation.",
      "representation": "storage"
    }
  },
  "version": {
    "number": 2,
    "message": "Added specific questions about OAuth"
  }
}
```

***

#### **3.4 deleteComment**
**Purpose**: Remove comments and cascading replies  
**Workflow Support**: Content moderation, cleanup, resolved feedback

```http
DELETE /wiki/rest/api/content/{commentId}
Authorization: Bearer {PAT}
```

**Cascade Effect**: Deletes comment and all nested replies automatically.