# Sprint 1.2: Core Page Tools

**Duration**: 3 working days (3MD)  
**Parent Sprint**: Sprint 1 - Foundation & Page Management (see [Project Roadmap](../01_plan/project-roadmap.md))  
**Status**: Not Started  
**Prerequisites**: [Sprint 1.1 - Setup & Infrastructure](sprint-01-1-setup.md) completed

## Sub-Sprint Overview

### Objective
Implement the first 3 core page management tools: createPage, getPageContent, and updatePage using Data Center API v1.

### Focus Areas
- Page creation with Confluence storage format
- Page content retrieval with labels integration
- Page content and title modification
- Data Center API v1 endpoint integration

### Deliverables
- createPage tool: Create new pages in specified spaces using spaceKey
- getPageContent tool: Retrieve complete page information with labels
- updatePage tool: Modify existing page title and content
- All tools tested with real Confluence Data Center API

## Task Breakdown

### Day 1: createPage Tool (1MD)

#### T1.2.1: Page Creation Tool
**Status**: Not Started  
**Estimate**: 1 day  
**Priority**: Critical  
**API**: `POST /rest/api/content`

**Tasks**:
- Define tool schema with required parameters (spaceKey, title, content)
- Implement API call to create pages using Data Center format
- Handle Confluence storage format content
- Add proper error handling for creation failures
- Test page creation in real Data Center space

**Implementation Reference**: 
- Tool pattern: [Implementation Guide - Standard Tool Structure](../00_context/implementation-guide.md#standard-tool-structure)
- API mapping: See [confluence-data-center-tools-reference.md](../00_context/confluence-data-center-tools-reference.md) (createPage section)

**Data Center Specific**:
- Use string `spaceKey` instead of numeric `spaceId`
- POST request body format specific to Data Center API v1
- Handle parent page hierarchy with ancestors array

**Acceptance Criteria**:
- Tool creates pages successfully in test space using spaceKey
- Content renders properly in Confluence UI
- Error handling for invalid spaceKey/parent IDs
- Proper response format for MCP client consumption
- Version number correctly set to 1 for new pages

---

### Day 2: getPageContent Tool (1MD)

#### T1.2.2: Page Content Retrieval Tool
**Status**: Not Started  
**Estimate**: 1 day  
**Priority**: Critical  
**API**: `GET /rest/api/content/{pageId}?expand=body.storage,version,space,ancestors`

**Tasks**:
- Implement API call to retrieve complete page data
- Include page labels in response using expand parameters
- Handle different body format options (storage, view)
- Format response for AI client consumption
- Test with pages containing various content types

**Implementation Reference**: 
- Tool pattern: [Implementation Guide - Standard Tool Structure](../00_context/implementation-guide.md#standard-tool-structure)
- API mapping: See [confluence-data-center-tools-reference.md](../00_context/confluence-data-center-tools-reference.md) (getPageDetails section)

**Data Center Specific**:
- Use extensive expand parameters available in Data Center
- Handle space information with spaceKey format
- Version information format specific to Data Center

**Acceptance Criteria**:
- Tool retrieves complete page data including content body
- Page labels included in response
- Different body formats work correctly (storage/view)
- Error handling for invalid page IDs
- Response format suitable for AI processing
- Space information includes both ID and key

---

### Day 3: updatePage Tool (1MD)

#### T1.2.3: Page Update Tool
**Status**: Not Started  
**Estimate**: 1 day  
**Priority**: Critical  
**API**: `PUT /rest/api/content/{pageId}`

**Tasks**:
- Implement API call to update page content and title
- Handle version-based optimistic locking
- Support partial updates (title only, content only, or both)
- Add version conflict error handling
- Test page updates with various content modifications

**Implementation Reference**: 
- Tool pattern: [Implementation Guide - Standard Tool Structure](../00_context/implementation-guide.md#standard-tool-structure)
- API mapping: See [confluence-data-center-tools-reference.md](../00_context/confluence-data-center-tools-reference.md) (updatePage section)

**Data Center Specific**:
- Full object PUT request format required by Data Center
- Version number increment handling
- Space key format in request body

**Acceptance Criteria**:
- Tool updates pages successfully
- Version conflict detection and proper error messages
- Partial updates (title-only, content-only) work correctly
- Version increment handled properly
- Update messages tracked in page history

---

## Integration & Testing

### Tool Registration
All tools must be registered with the MCP server in `src/tools/confluence/index.ts`:

```typescript
// src/tools/confluence/index.ts
import { registerCreatePageTool } from './create-page.js';
import { registerGetPageContentTool } from './get-page-content.js';
import { registerUpdatePageTool } from './update-page.js';

export function registerCorePageTools(server: McpServerWrapper) {
  registerCreatePageTool(server);
  registerGetPageContentTool(server);  
  registerUpdatePageTool(server);
}
```

### Daily Validation
- **Day 1**: Create test pages in development Data Center space using spaceKey
- **Day 2**: Retrieve created pages with labels verification
- **Day 3**: Update test pages and verify version management

### Content Format Validation
See [Implementation Guide - Content Format Handling](../00_context/implementation-guide.md#content-format-handling) for supported Confluence storage format examples and validation patterns.

## Data Center API Integration

### Authentication Pattern
All API calls use Personal Access Token:
```typescript
headers: {
  'Authorization': `Bearer ${personalAccessToken}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Error Handling Strategy
Common error scenarios for Data Center:
- **401 Unauthorized**: Invalid Personal Access Token
- **403 Forbidden**: Insufficient space permissions
- **404 Not Found**: Invalid space key/page IDs
- **409 Conflict**: Version conflicts on updates
- **400 Bad Request**: Malformed content or missing required fields

### API Endpoint Patterns
- **Base URL**: `{baseUrl}/rest/api` (Data Center v1)
- **Space Reference**: Use `spaceKey` strings throughout
- **Expand Usage**: Leverage extensive expand parameters for single-call data retrieval
- **Pagination**: Offset-based with start/limit (not used in these tools)

## Sub-Sprint Completion Criteria

- All 3 tools implemented and registered
- Tools tested with real Confluence Data Center API calls
- Error handling prevents server crashes
- Content format validation working
- Version management for updates operational
- Personal Access Token authentication working for all tools

## Handoff to Sprint 1.3

### Deliverables Ready
- 3 core page tools: createPage, getPageContent, updatePage
- Storage format content handling
- Error handling patterns established
- API client extended with page operations
- Data Center API v1 integration patterns established

### Next Sub-Sprint
[Sprint 1.3 - Completion & Integration](sprint-01-3-completion.md) will add the remaining tools (deletePage, getSpaces) and complete Sprint 1 integration testing.

---

**Sub-Sprint Status**: Not Started  
**Duration**: 3 working days  
**Next Action**: Begin T1.2.1 - createPage Tool Implementation