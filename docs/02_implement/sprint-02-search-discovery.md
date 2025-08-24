# Sprint 2: Search & Discovery Tools

**Duration**: 7 working days (7MD)  
**Parent Sprint**: Sprint 2 - Search & Discovery (see [Project Roadmap](../01_plan/project-roadmap.md))  
**Status**: Not Started  
**Prerequisites**: [Sprint 1 - Page Management](sprint-01-3-completion.md) completed

## Sprint Overview

### Objective
Implement comprehensive search and discovery capabilities with advanced CQL filtering and complete version history tracking using Data Center REST API v1 per tool reference.

### Focus Areas
- Universal page search with advanced CQL query support per reference section 2.1
- Complete version history tracking and change analysis per reference section 2.2
- Enhanced error handling standardization across all tools
- Integration testing with existing page management tools

### Deliverables
- searchPages tool: Universal content discovery with CQL filtering per tool reference
- getPageVersions tool: Complete version history with rollback preparation per tool reference
- Integration testing of all 7 tools (5 page management + 2 search & discovery)
- Sprint 2 completion validation against enhanced success criteria

## Task Breakdown

### Week 1: searchPages Tool Implementation (4MD)

#### T2.1.1: Advanced searchPages Tool (4 days)
**Status**: Not Started  
**Estimate**: 4 days  
**Priority**: Critical  
**API**: `GET /wiki/rest/api/content/search?cql={cqlQuery}&start={start}&limit={limit}&expand=space,version,ancestors`

**Enhanced Implementation Tasks**:
- Implement comprehensive CQL query support per reference with multi-criteria filtering
- Support advanced search patterns (title, text, creator, date, label, space filtering)
- Handle fallback to basic content API when CQL restrictions exist per reference
- Implement enhanced pagination with comprehensive result metadata
- Add advanced error handling for CQL syntax and permissions
- Test with complex search scenarios and performance optimization

**Tool Reference Compliance**: 
- Primary API: `GET /wiki/rest/api/content/search` with comprehensive CQL support per reference section 2.1
- Fallback API: `GET /wiki/rest/api/content` with basic filtering per reference
- Enhanced response structure with space, version, ancestors expansion per reference
- Complete error handling scenarios as documented (401, 403, CQL syntax errors)

**Data Center REST v1 Features**:
- Complete CQL query language support with advanced filtering capabilities
- Enhanced expand parameters for optimal single-call result enrichment
- Comprehensive pagination with start/limit and totalSize metadata
- Fallback mechanisms for restricted CQL environments

**Advanced CQL Implementation**:
```typescript
// Multi-criteria search examples per reference
const cqlExamples = {
  multiCriteria: 'type=page AND (title~"API documentation" OR text~"authentication") AND space.key="DOCS" AND lastModified >= "2024-01-01"',
  authorAndDate: 'type=page AND creator="john.doe" AND created >= startOfWeek() AND space.category="Technical"',
  contentTypeLabel: 'type=page AND label in ("important", "review-required") AND contributor in ("jane.smith", "bob.jones")',
  hierarchicalSearch: 'type=page AND ancestor="123456" AND title~"implementation" AND lastModified >= "2024-08-01"'
};
```

**Enhanced Acceptance Criteria**:
- Tool performs universal page search with comprehensive CQL support per reference
- Advanced multi-criteria filtering working correctly (title, text, creator, date, labels)
- Enhanced pagination handles large result sets with proper totalSize and _links
- Fallback to basic content API working when CQL restricted per reference
- Complete error handling for CQL syntax errors and permission restrictions
- Response structure optimized for AI processing with space, version, ancestors data
- Performance optimized for large Data Center instances

---

### Week 2: getPageVersions Tool & Integration (3MD)

#### T2.1.2: Complete getPageVersions Tool (2 days)
**Status**: Not Started  
**Estimate**: 2 days  
**Priority**: Critical  
**API**: `GET /wiki/rest/api/content/{pageId}/version?start={start}&limit={limit}`

**Enhanced Implementation Tasks**:
- Implement comprehensive version history retrieval per reference
- Include complete author information with profile pictures and timing data
- Support enhanced pagination for pages with extensive edit history
- Add version comparison capabilities preparation
- Handle version message and minor edit tracking per reference
- Test with pages having complex version histories and large edit counts

**Tool Reference Compliance**: 
- API endpoint: `GET /wiki/rest/api/content/{pageId}/version` per reference section 2.2
- Complete response structure with author, timing, message, minorEdit data per reference
- Enhanced pagination support for comprehensive version history retrieval
- Full error handling scenarios as documented (401, 403, 404)

**Data Center REST v1 Features**:
- Complete version metadata with author profiles and edit classification
- Enhanced pagination for extensive version histories
- Version message tracking for collaboration history analysis
- Minor edit classification for change significance analysis

**Enhanced Acceptance Criteria**:
- Tool retrieves complete version history with comprehensive metadata per reference
- Enhanced pagination works for pages with extensive edit histories
- Complete author information includes displayName, accountId, and profile pictures per reference
- Version messages and minor edit classification properly tracked per reference
- Complete error handling for permission and access scenarios (401, 403, 404)
- Response structure optimized for version analysis and rollback preparation
- Performance optimized for pages with hundreds of versions

---

#### T2.1.3: Sprint 2 Integration Testing & Validation (1 day)
**Status**: Not Started  
**Estimate**: 1 day  
**Priority**: Critical

**Enhanced Integration Test Scenarios**:
- **Complete Search & Discovery Workflow**: searchPages → getPageContent → getPageVersions → updatePage workflow validation
- **Advanced Search Validation**: Complex CQL queries with multi-criteria filtering and fallback testing
- **Version History Analysis**: Complete version tracking with author and change analysis
- **Error Handling Integration**: Comprehensive error scenarios across all 7 tools
- **Performance Testing**: Large result set handling and pagination validation

**Enhanced Integration Test Workflow**:
```typescript
// Enhanced integration test scenario for search & discovery
1. searchPages() - Complex CQL search across multiple spaces and criteria
2. getPageContent() - Retrieve detailed information for search results
3. getPageVersions() - Analyze version history for selected pages
4. updatePage() - Test version control integration with search results
5. searchPages() - Verify updated pages appear in subsequent searches
6. getSpaces() - Validate space context for search result organization
7. deletePage() - Test search result filtering after page deletion
```

**Data Center Specific Validation**:
- Bearer Personal Access Token authentication across all 7 tools
- Complete spaceKey handling with validation per reference across search and page operations
- Enhanced API REST v1 endpoint responses per reference specifications
- CQL query performance optimization and fallback mechanism validation
- Version control integration between search results and page operations

**Enhanced Validation Checklist**:
- All 7 tools (5 page management + 2 search & discovery) execute without errors per reference specifications
- MCP server remains stable under comprehensive search and version analysis load testing
- Enhanced error responses provide detailed context without server crashes
- Tool responses format correctly for AI clients per reference response structures
- Bearer Personal Access Token authentication remains valid across all tool combinations
- Complex CQL queries perform optimally with proper fallback handling
- Version history analysis integrates seamlessly with page management workflows
- Search result pagination handles large Data Center instances efficiently

## Tool Registration & Architecture

### Complete Sprint 2 Tool Registration
```typescript
// src/tools/confluence/index.ts - After Sprint 2
import { registerCreatePageTool } from './create-page.js';
import { registerGetPageContentTool } from './get-page-content.js';
import { registerUpdatePageTool } from './update-page.js';
import { registerDeletePageTool } from './delete-page.js';
import { registerGetSpacesTool } from './get-spaces.js';
import { registerSearchPagesTool } from './search-pages.js';
import { registerGetPageVersionsTool } from './get-page-versions.js';

export function registerAllSprint2Tools(server: McpServerWrapper) {
  // Sprint 1 tools
  registerCreatePageTool(server);
  registerGetPageContentTool(server);  
  registerUpdatePageTool(server);
  registerDeletePageTool(server);
  registerGetSpacesTool(server);
  
  // Sprint 2 tools
  registerSearchPagesTool(server);
  registerGetPageVersionsTool(server);
}
```

### Enhanced API Client Status After Sprint 2
```typescript
// src/utils/confluence-api.ts - Complete Sprint 2 methods
class ConfluenceDataCenterApiClient {
  // Infrastructure
  constructor(config: ConfluenceDataCenterConfig)
  private async request(endpoint: string, options: RequestOptions)
  async testConnection(): Promise<boolean>
  
  // Sprint 1 Page Management tools
  async createPage(data: CreatePageData): Promise<Page>
  async getPageContent(pageId: string, expand?: string): Promise<PageWithContent>
  async updatePage(pageId: string, data: UpdatePageData): Promise<Page>
  async deletePage(pageId: string, status?: string): Promise<DeletePageResponse>
  async getSpaces(params: GetSpacesParams): Promise<SpacesResult>
  
  // Sprint 2 Search & Discovery tools
  async searchPages(params: SearchPagesParams): Promise<SearchResult>
  async getPageVersions(pageId: string, params: VersionParams): Promise<VersionsResult>
}
```

## Data Center Integration Validation

### Enhanced Authentication Testing
- Bearer Personal Access Token format validation across all 7 tools
- Token permission verification for search operations and version access
- Cross-tool authentication consistency validation

### Enhanced API Endpoint Testing
- All endpoints use `/wiki/rest/api/` base path per reference
- CQL query validation and fallback mechanism testing
- Enhanced expand parameter utilization across search and version tools
- Error response format consistency across all tool combinations

### Enterprise Environment Testing
- SSL certificate handling for all search and version operations
- Base URL normalization for various deployment paths with search endpoints
- Network timeout and error handling for complex CQL queries and large version histories

## Risk Assessment & Mitigation

### Sprint 2 Completion Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| CQL query complexity underestimated | High | Medium | Implement fallback to basic content API per reference |
| Version history performance issues | Medium | High | Optimize pagination and implement result limiting |
| Search integration complexity | Medium | Medium | Focus on core search functionality first, enhance iteratively |
| Authentication across multiple tools | Medium | Low | Leverage established Sprint 1 authentication patterns |

### Quality Assurance
- **Code Review**: Self-review against tool reference specifications and implementation guide patterns
- **API Testing**: Validate against real Data Center instance with complex search scenarios
- **Performance Testing**: Test with large result sets and extensive version histories
- **Integration Testing**: Validate seamless integration with existing page management tools

## Sprint Completion Criteria

### Enhanced Sprint 2 Success Criteria
- searchPages tool with comprehensive CQL support and fallback mechanism implemented per reference
- getPageVersions tool with complete version history and metadata retrieval per reference
- All 7 tools (page management + search & discovery) registered and comprehensively tested
- Enhanced integration testing passed with complex search and version analysis workflows
- Enhanced Sprint 2 success criteria met and documented per reference specifications
- Project roadmap updated with completion status and search capability validation
- All search & discovery tools fully compliant with tool reference API mappings and response structures

## Sprint 2 Completion & Handoff

### Enhanced Sprint 2 Final Deliverables
- 7 operational tools total: 5 page management + 2 search & discovery per reference
- Enhanced MCP server infrastructure with comprehensive search and discovery capabilities
- Complete API client with advanced CQL query support and version history analysis
- Comprehensive error handling and validation across all tool combinations per reference specifications
- Enhanced integration testing validation with complex multi-tool workflows
- Enterprise SSL certificate handling for all search and version operations
- Complete search and discovery workflows with advanced filtering and version analysis
- Full compliance with tool reference API mappings and response structures for all 7 tools

### Preparation for Sprint 3
Sprint 3 will focus on complete comment system per reference (getPageComments, addComment, updateComment, deleteComment). The enhanced foundation established in Sprints 1 & 2 provides:
- Complete API client ready for comment operations with established authentication patterns
- Enhanced tool registration patterns established per reference specifications for all tool types
- Comprehensive error handling framework in place per reference across all operation types
- Complete Data Center REST API v1 integration patterns established per reference for all endpoints
- Fully operational development environment with Bearer PAT authentication across all tools
- Complete page management and search workflows as foundation for comment operations

### Next Steps
1. **Review**: Sprint 2 completion against [Project Roadmap](../01_plan/project-roadmap.md)
2. **Update**: Roadmap status for Sprint 2 completion and search capability validation
3. **Plan**: Sprint 3 comment system implementation per reference specifications
4. **Continue**: Maintain development momentum with established patterns

---

**Sprint Status**: Not Started  
**Duration**: 7 working days  
**Sprint 2 Goal**: Complete search & discovery capabilities with advanced CQL and version history per reference