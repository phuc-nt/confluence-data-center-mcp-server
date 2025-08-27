# Confluence Data Center MCP Server - API Reference

> Complete reference for all 11 production-ready tools in the Confluence Data Center MCP Server

## Overview

This document provides comprehensive API reference for all tools available in the Confluence Data Center MCP Server. Each tool is designed for natural language interaction through AI assistants while maintaining full compatibility with the Confluence Data Center REST API v1.

## Tool Categories

### 📄 Page Management (5 tools)
- [createPage](#createpage) - Create new pages with rich content
- [getPageContent](#getpagecontent) - Retrieve complete page information
- [updatePage](#updatepage) - Update page content with version control
- [deletePage](#deletepage) - Remove pages safely
- [getSpaces](#getspaces) - List and explore workspace spaces

### 🔍 Search & Discovery (2 tools)
- [searchPages](#searchpages) - Universal content search with CQL
- [getPageVersions](#getpageversions) - Access page version history

### 💬 Comment Management (4 tools)
- [getPageComments](#getpagecomments) - Retrieve page comments and replies
- [addComment](#addcomment) - Add comments with threading support
- [updateComment](#updatecomment) - Edit existing comments
- [deleteComment](#deletecomment) - Remove comments with cascade deletion

---

## Page Management Tools

### createPage

Create new pages with rich content and hierarchical organization.

**Parameters:**
- `spaceKey` (required): Target space key for the new page
- `title` (required): Page title
- `content` (required): Page content in Confluence storage format
- `parentPageId` (optional): Parent page ID for child page creation

**Example Usage:**
```
Human: Create a new page called "API Documentation" in the DEV space

AI Assistant: I'll create that page for you using createPage:
- Space: DEV
- Title: "API Documentation"
- Content: Basic page structure with sections...
```

**Response Format:**
```json
{
  "success": true,
  "page": {
    "id": "123456789",
    "type": "page",
    "title": "API Documentation",
    "space": {
      "id": 98765,
      "key": "DEV",
      "name": "Development"
    },
    "version": {
      "number": 1,
      "by": {
        "type": "known",
        "accountId": "user123",
        "displayName": "John Doe"
      },
      "when": "2025-08-25T10:00:00.000Z",
      "message": ""
    },
    "_links": {
      "webui": "/pages/123456789",
      "self": "https://your-confluence-dc.company.com/rest/api/content/123456789"
    }
  }
}
```

---

### getPageContent

Retrieve complete page information including content, metadata, and relationships. Supports historical version access for content comparison workflows.

**Parameters:**
- `pageId` (required): Unique page identifier
- `versionNumber` (optional): Specific version number to retrieve historical content (from getPageVersions)

**Example Usage:**
```
Human: Get the content of page 123456, and also show me version 3 for comparison

AI Assistant: I'll retrieve both current and historical content using getPageContent:
- Current version: getPageContent(123456)
- Historical version: getPageContent(123456, versionNumber: 3)
- Comparing content changes...
```

**Response Format:**
```json
{
  "success": true,
  "page": {
    "id": "123456789",
    "type": "page",
    "title": "API Documentation",
    "space": {
      "id": 98765,
      "key": "DEV",
      "name": "Development",
      "_links": {
        "webui": "/spaces/DEV"
      }
    },
    "body": {
      "storage": {
        "value": "<p>Page content in storage format...</p>",
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
      "when": "2025-08-25T09:30:00.000Z",
      "message": "Updated API examples"
    },
    "ancestors": [
      {
        "id": "111111",
        "title": "Parent Page"
      }
    ]
  }
}
```

---

### updatePage

Update page content and title with version control and conflict resolution.

**Parameters:**
- `pageId` (required): Target page identifier
- `title` (required): Updated page title
- `content` (required): Updated page content in storage format
- `versionNumber` (required): Current version number for optimistic locking
- `versionMessage` (optional): Change description for version history

**Example Usage:**
```
Human: Update page 123456 to version 6 with new security section

AI Assistant: I'll update the page using updatePage:
- Page ID: 123456
- Version: 6 (current: 5)
- Adding security section...
```

**Response Format:**
```json
{
  "success": true,
  "page": {
    "id": "123456789",
    "title": "API Documentation",
    "version": {
      "number": 6,
      "by": {
        "type": "known",
        "accountId": "user456",
        "displayName": "Bob Smith"
      },
      "when": "2025-08-25T11:00:00.000Z",
      "message": "Added security section"
    }
  },
  "previousVersion": 5,
  "updateMessage": "Added security section"
}
```

---

### deletePage

Remove pages safely with recoverable soft delete options.

**Parameters:**
- `pageId` (required): Page identifier to delete

**Example Usage:**
```
Human: Delete page 123456

AI Assistant: I'll safely delete the page using deletePage:
- Page ID: 123456
- Using soft delete for recovery...
```

**Response Format:**
```json
{
  "success": true,
  "page": {
    "id": "123456789",
    "status": "trashed",
    "title": "API Documentation",
    "deletedAt": "2025-08-25T12:00:00.000Z"
  },
  "recoverable": true,
  "message": "Page moved to trash and can be recovered"
}
```

---

### getSpaces

List and explore available workspace spaces with permissions and metadata.

**Parameters:**
- `start` (optional): Pagination start index (default: 0)
- `limit` (optional): Number of spaces to return (default: 25)

**Example Usage:**
```
Human: List all spaces in my Confluence workspace

AI Assistant: I'll retrieve all available spaces using getSpaces:
- Fetching workspace spaces...
- Including permissions and metadata...
```

**Response Format:**
```json
{
  "success": true,
  "spaces": [
    {
      "id": 98765,
      "key": "DEV",
      "name": "Development",
      "type": "global",
      "status": "current",
      "description": {
        "plain": {
          "value": "Development team workspace",
          "representation": "plain"
        }
      },
      "homepage": {
        "id": "555555",
        "title": "Development Home",
        "_links": {
          "webui": "/pages/555555"
        }
      },
      "_links": {
        "webui": "/spaces/DEV",
        "self": "https://your-confluence-dc.company.com/rest/api/space/DEV"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1
}
```

---

## Search & Discovery Tools

### searchPages

Universal content search with CQL support and advanced filtering capabilities.

**Parameters:**
- `query` (required): Search query or CQL expression
- `spaceKey` (optional): Limit search to specific space
- `start` (optional): Pagination start index (default: 0)
- `limit` (optional): Number of results to return (default: 25)

**Example Usage:**
```
Human: Find all pages about authentication from last month

AI Assistant: I'll search for authentication content using searchPages:
- Query: "text~authentication AND created >= -30d"
- Searching across all accessible spaces...
```

**Response Format:**
```json
{
  "success": true,
  "results": [
    {
      "id": "789012345",
      "type": "page",
      "title": "User Authentication Guide",
      "space": {
        "key": "DOCS",
        "name": "Documentation"
      },
      "version": {
        "number": 3,
        "when": "2025-08-20T15:30:00.000Z",
        "by": {
          "displayName": "John Doe"
        }
      },
      "ancestors": [
        {
          "id": "111111",
          "title": "Security Documentation"
        }
      ],
      "_links": {
        "webui": "/pages/789012345"
      }
    }
  ],
  "start": 0,
  "limit": 25,
  "totalSize": 45,
  "cqlQuery": "text~authentication AND created >= -30d"
}
```

---

### getPageVersions

Access complete page version history for change tracking and content comparison. Enhanced with experimental API for full history access.

**Parameters:**
- `pageId` (required): Page identifier
- `start` (optional): Pagination start index (default: 0)
- `limit` (optional): Number of versions to return (default: 25)

**Example Usage:**
```
Human: Show me the version history of page 123456

AI Assistant: I'll retrieve the complete version history using getPageVersions:
- Page ID: 123456  
- Using experimental endpoint for complete history access
- Fetching all version information with content links...
```

**Response Format:**
```json
{
  "success": true,
  "versions": [
    {
      "by": {
        "type": "known",
        "accountId": "user456",
        "displayName": "Jane Smith",
        "profilePicture": {
          "path": "/profilepictures/user456.png"
        }
      },
      "when": "2025-08-25T09:30:00.000Z",
      "number": 5,
      "message": "Added implementation examples",
      "minorEdit": false,
      "_links": {
        "self": "https://your-confluence-dc.company.com/rest/api/content/123456789/version/5"
      }
    },
    {
      "by": {
        "type": "known",
        "accountId": "user123",
        "displayName": "John Doe"
      },
      "when": "2025-08-24T14:30:00.000Z",
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

---

## Comment Management Tools

### getPageComments

Retrieve page comments and replies with threading support and pagination.

**Parameters:**
- `pageId` (required): Page identifier
- `start` (optional): Pagination start index (default: 0)
- `limit` (optional): Number of comments to return (default: 25)

**Example Usage:**
```
Human: Get all comments on page 123456

AI Assistant: I'll retrieve the page comments using getPageComments:
- Page ID: 123456
- Including threaded replies...
```

**Response Format:**
```json
{
  "success": true,
  "comments": [
    {
      "id": "comment123456",
      "type": "comment",
      "title": "Re: API Documentation",
      "body": {
        "storage": {
          "value": "Great explanation! Could you add OAuth examples?",
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
        "when": "2025-08-25T16:45:00.000Z"
      },
      "ancestors": [
        {
          "id": "123456789",
          "type": "page",
          "title": "API Documentation"
        }
      ],
      "children": {
        "comment": {
          "results": [
            {
              "id": "comment789012",
              "title": "Re: Re: API Documentation",
              "body": {
                "storage": {
                  "value": "@Bob Wilson I'll add OAuth examples soon.",
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

---

### addComment

Add comments with reply threading support and content validation.

**Parameters:**
- `pageId` (required): Target page identifier
- `content` (required): Comment content in storage format
- `parentCommentId` (optional): Parent comment ID for threaded replies

**Example Usage:**
```
Human: Add a comment to page 123456 asking for security review

AI Assistant: I'll add your comment using addComment:
- Page ID: 123456
- Comment: Requesting security review...
```

**Response Format:**
```json
{
  "success": true,
  "comment": {
    "id": "comment345678",
    "type": "comment",
    "title": "Re: API Documentation",
    "body": {
      "storage": {
        "value": "Please review the security section for completeness.",
        "representation": "storage"
      }
    },
    "version": {
      "number": 1,
      "by": {
        "type": "known",
        "accountId": "user123",
        "displayName": "Current User"
      },
      "when": "2025-08-25T17:00:00.000Z",
      "message": ""
    },
    "ancestors": [
      {
        "id": "123456789",
        "type": "page",
        "title": "API Documentation"
      }
    ],
    "_links": {
      "webui": "/pages/123456789#comment-comment345678",
      "self": "https://your-confluence-dc.company.com/rest/api/content/comment345678"
    }
  },
  "createdAt": "2025-08-25T17:00:00.000Z"
}
```

---

### updateComment

Edit existing comments with version control and conflict handling.

**Parameters:**
- `commentId` (required): Comment identifier to update
- `content` (required): Updated comment content in storage format
- `versionNumber` (required): Current version number for optimistic locking
- `versionMessage` (optional): Version update message

**Example Usage:**
```
Human: Update comment comment123456 with additional questions

AI Assistant: I'll update the comment using updateComment:
- Comment ID: comment123456
- Adding additional questions...
```

**Response Format:**
```json
{
  "success": true,
  "comment": {
    "id": "comment123456",
    "type": "comment",
    "title": "Re: API Documentation",
    "body": {
      "storage": {
        "value": "Updated: Great explanation! Could you add OAuth examples and error handling?",
        "representation": "storage"
      }
    },
    "version": {
      "number": 2,
      "by": {
        "type": "known",
        "accountId": "user789",
        "displayName": "Bob Wilson"
      },
      "when": "2025-08-25T17:15:00.000Z",
      "message": "Added error handling question"
    }
  },
  "previousVersion": 1,
  "updateMessage": "Added error handling question"
}
```

---

### deleteComment

Remove comments with cascading reply deletion and safe removal.

**Parameters:**
- `commentId` (required): Comment identifier to delete

**Example Usage:**
```
Human: Delete comment comment123456

AI Assistant: I'll remove the comment using deleteComment:
- Comment ID: comment123456
- This will also remove any nested replies...
```

**Response Format:**
```json
{
  "success": true,
  "comment": {
    "id": "comment123456",
    "status": "deleted",
    "deletedAt": "2025-08-25T17:30:00.000Z"
  },
  "cascadeEffect": true,
  "message": "Comment and all nested replies have been permanently deleted"
}
```

---

## Error Handling

All tools implement comprehensive error handling with specific error codes and messages:

### Common Error Types

**Authentication Errors (401):**
```json
{
  "success": false,
  "error": "Authentication failed. Check Personal Access Token."
}
```

**Permission Errors (403):**
```json
{
  "success": false,
  "error": "Insufficient permissions to access page \"123456\". Check page permissions."
}
```

**Not Found Errors (404):**
```json
{
  "success": false,
  "error": "Page \"123456\" not found or not accessible."
}
```

**Version Conflict Errors (409):**
```json
{
  "success": false,
  "error": "Version conflict - page has been updated by another user. Current version: 7, provided version: 5. Please get the latest version and retry."
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "error": "Invalid page data: Title cannot be empty."
}
```

---

## Configuration

### Environment Variables

**Required:**
- `CONFLUENCE_BASE_URL`: Your Confluence Data Center base URL
- `CONFLUENCE_PERSONAL_ACCESS_TOKEN`: Personal Access Token for authentication

**Optional:**
- `MCP_SERVER_NAME`: Custom server name (default: "confluence-dc-mcp-server")
- `MCP_SERVER_VERSION`: Custom version (default: "1.0.0")

### Example MCP Client Configuration

```json
{
  "mcpServers": {
    "confluence-dc": {
      "disabled": false,
      "timeout": 60,
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/confluence-dc-mcp-server/dist/index.js"],
      "env": {
        "CONFLUENCE_BASE_URL": "https://your-confluence-dc.company.com",
        "CONFLUENCE_PERSONAL_ACCESS_TOKEN": "your-personal-access-token"
      }
    }
  }
}
```

---

## Best Practices

### Version Control
- Always check current version with `getPageVersions` before updating
- Use descriptive version messages for change tracking
- Handle version conflicts gracefully with retry logic

### Search Optimization
- Use CQL queries for precise filtering in `searchPages`
- Implement pagination for large result sets
- Combine multiple search strategies for best coverage

### Comment Management
- Check for existing comments with `getPageComments` before adding
- Use threaded replies for organized discussions
- Consider cascade effects when deleting comments

### Error Recovery
- Implement retry logic for network issues
- Provide clear error messages to users
- Log detailed error information for troubleshooting

---

**For complete installation and setup instructions, see [INSTALL.md](INSTALL.md)**  
**For general project information, see [README.md](README.md)**