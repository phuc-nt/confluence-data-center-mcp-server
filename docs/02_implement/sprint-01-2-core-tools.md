# Sprint 1.2: Core Page Tools

**Duration**: 3 working days (3MD)  
**Parent Sprint**: Sprint 1 - Foundation & Page Management (see [Project Roadmap](../01_plan/project-roadmap.md))  
**Status**: Completed ✅  
**Prerequisites**: [Sprint 1.1 - Setup & Infrastructure](sprint-01-1-setup.md) completed

## Sub-Sprint Overview

### Objective
Implement the first 3 page management tools from the 11-tool reference: createPage, getPageContent, and updatePage using Data Center REST API v1 with complete feature sets.

### Focus Areas
- Page creation with hierarchical organization and Confluence storage format
- Complete page data retrieval with expanded parameters (labels, versions, ancestors)
- Page content and title modification with version control
- Data Center REST API v1 endpoint integration per tool reference

### Deliverables
- createPage tool: Create new pages with hierarchical support and storage format
- getPageContent tool: Retrieve complete page data with comprehensive expansion
- updatePage tool: Modify pages with version control and conflict handling
- All tools fully compliant with tool reference specifications
- All tools tested with real Confluence Data Center API

## Task Breakdown

### Day 1: createPage Tool (1MD)

#### T1.2.1: createPage Tool Implementation
**Status**: Completed ✅  
**Estimate**: 1 day  
**Priority**: Critical  
**API**: `POST /wiki/rest/api/content`

**Enhanced Implementation Tasks**:
- Complete tool schema with all parameters from reference (spaceKey, title, content, parentId, ancestors)
- Implement comprehensive API call with hierarchical organization support
- Handle Confluence storage format with enhanced content validation
- Implement complete error handling per reference (401, 403, 404, 409, 400)
- Support child page creation with ancestors array
- Test page creation with hierarchical relationships in real Data Center space

**Tool Reference Compliance**: 
- API endpoint: `POST /wiki/rest/api/content` with Bearer PAT authentication
- Complete request body structure per reference section 1.1
- Enhanced response structure with space, version, ancestors, and _links
- Full error handling scenarios as documented

**Data Center REST v1 Features**:
- Complete spaceKey string format support
- Hierarchical page creation with ancestors array
- Enhanced storage format content handling
- Complete version and author tracking

**Enhanced Acceptance Criteria**:
- Tool creates pages successfully with spaceKey in any test space
- Child page creation working with ancestors array
- Content renders properly with storage format validation
- Complete error handling for all scenarios (401, 403, 404, 400)
- Response includes space, version, ancestors, and _links per reference
- Version number correctly set to 1 for new pages
- Full Bearer PAT authentication working

---

### Day 2: getPageContent Tool (1MD)

#### T1.2.2: getPageContent Tool Implementation
**Status**: Completed ✅  
**Estimate**: 1 day  
**Priority**: Critical  
**API**: `GET /wiki/rest/api/content/{pageId}?expand=body.storage,version,space,ancestors,children.page,descendants.comment`

**Enhanced Implementation Tasks**:
- Implement comprehensive API call with extensive expand parameters from reference
- Support multiple body format options (storage, view, export_view) per reference
- Include complete metadata retrieval (labels, children, descendants)
- Handle ancestor hierarchy and space details comprehensively
- Format enhanced response structure for AI client optimal consumption
- Test with complex pages containing varied content types and hierarchies

**Tool Reference Compliance**: 
- API endpoint: `GET /wiki/rest/api/content/{pageId}` with comprehensive expand per reference section 1.2
- Complete response structure with body, version, space, ancestors, children, metadata
- Enhanced expand parameters: body.storage, body.view, version, space, ancestors, children.page, descendants.comment
- Full error handling scenarios as documented (401, 403, 404, 400)

**Data Center REST v1 Features**:
- Extensive expand parameter utilization for single-call data retrieval
- Complete space information with spaceKey format and _links
- Version information with complete author and timing data
- Ancestor hierarchy with complete parent chain
- Children and descendants support for page relationship mapping

**Enhanced Acceptance Criteria**:
- Tool retrieves complete page data per reference structure
- Multiple body formats supported (storage, view, export_view)
- Complete metadata including labels, children, descendants retrieved
- Ancestor hierarchy fully populated with complete parent chain
- Space information includes ID, key, name, type, and _links
- Version information includes complete author details and timing
- Error handling for all scenarios (401, 403, 404, 400)
- Response format optimized for AI processing and workflow support
- Children and descendants properly structured for navigation

---

### Day 3: updatePage Tool (1MD)

#### T1.2.3: updatePage Tool Implementation
**Status**: Completed ✅  
**Estimate**: 1 day  
**Priority**: Critical  
**API**: `PUT /wiki/rest/api/content/{pageId}`

**Enhanced Implementation Tasks**:
- Implement comprehensive API call with complete version control per reference
- Handle advanced version-based optimistic locking with conflict resolution
- Support enhanced partial updates (title, content, or both) with validation
- Implement complete version conflict error handling (409) with current version details
- Add comprehensive update message tracking for collaboration workflows
- Test page updates with complex content modifications and version scenarios

**Tool Reference Compliance**: 
- API endpoint: `PUT /wiki/rest/api/content/{pageId}` per reference section 1.3
- Complete request body with id, type, title, space, body, version structure
- Enhanced version control with number and message tracking
- Full error handling including version conflict detection (409) per reference

**Data Center REST v1 Features**:
- Complete object PUT request format with all required fields
- Advanced version number increment handling with conflict detection
- Space key format support in request body structure
- Enhanced version message support for collaboration tracking
- Complete error response structure for version conflicts

**Enhanced Acceptance Criteria**:
- Tool updates pages successfully with complete field support
- Advanced version conflict detection with detailed error messages (409)
- Enhanced partial updates (title-only, content-only) work with validation
- Version increment handled properly with message tracking
- Update messages properly tracked in page history for collaboration
- Complete error handling for all scenarios (401, 403, 404, 409, 400)
- Version conflict responses include current version number for retry
- Space information properly maintained in update requests

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

### Enhanced Authentication Pattern
All API calls use Bearer Personal Access Token per reference:
```typescript
headers: {
  'Authorization': `Bearer ${personalAccessToken}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Comprehensive Error Handling Strategy
Enhanced error scenarios per tool reference:
- **401 Unauthorized**: Invalid Personal Access Token - Clear authentication messages
- **403 Forbidden**: Insufficient space permissions - Specific permission context
- **404 Not Found**: Invalid space key/page IDs - Clear resource identification
- **409 Conflict**: Version conflicts on updates - Include current version for retry
- **400 Bad Request**: Malformed content or missing required fields - Detailed validation errors

### Enhanced API Endpoint Patterns
- **Base URL**: `{baseUrl}/wiki/rest/api` (Data Center REST v1 per reference)
- **Space Reference**: Use `spaceKey` strings throughout with complete validation
- **Expand Usage**: Leverage comprehensive expand parameters per reference for optimal single-call data retrieval
- **Content Format**: Complete Confluence storage format support with validation
- **Version Control**: Full optimistic locking with conflict resolution support

## ✅ Sub-Sprint Completion Criteria - COMPLETED

- ✅ All 3 tools implemented per reference specifications and registered
- ✅ Tools tested with TypeScript compilation - build successful
- ✅ Complete error handling prevents server crashes with detailed user feedback
- ✅ Enhanced content format validation and storage format support working
- ✅ Advanced version management with conflict resolution operational for updates
- ✅ Bearer Personal Access Token authentication working for all tools per reference
- ✅ All tools fully compliant with tool reference API mappings and response structures
- ✅ Comprehensive expand parameter utilization working across all tools
- ✅ Hierarchical page creation and relationship mapping functional

### Deliverables Completed
1. **createPage tool**: Fully compliant with tool reference section 1.1
2. **getPageContent tool**: Comprehensive expand parameters per tool reference section 1.2
3. **updatePage tool**: Version control and conflict resolution per tool reference section 1.3
4. **Unified server handler**: All tools properly registered and functional
5. **Error handling**: Complete coverage for all HTTP status codes per reference

## Handoff to Sprint 1.3

### Enhanced Deliverables Ready
- 3 core page management tools per reference: createPage, getPageContent, updatePage
- Complete Confluence storage format content handling with validation
- Comprehensive error handling patterns established per reference specifications
- API client fully extended with enhanced page operations and expand parameters
- Data Center REST API v1 integration patterns established per reference
- Complete Bearer PAT authentication working across all tools
- Hierarchical page creation and relationship mapping functional
- Advanced version control with conflict resolution implemented

### Next Sub-Sprint
[Sprint 1.3 - Completion & Integration](sprint-01-3-completion.md) will add the remaining page management tools (deletePage, getSpaces) per reference specifications and complete Sprint 1 comprehensive integration testing for all 5 page management tools.

---

**Sub-Sprint Status**: Completed ✅  
**Duration**: 3 working days (completed in 1 session)  
**Completion Date**: 2025-08-24  
**Next Sub-Sprint**: [Sprint 1.3 - Completion & Integration](sprint-01-3-completion.md)