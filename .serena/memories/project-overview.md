# Confluence Data Center MCP Server - Project Overview

## Project Purpose
**Confluence Data Center MCP Server** là một Model Context Protocol (MCP) server giúp các AI assistants như Claude, Cline, Cursor tương tác với self-hosted Atlassian Confluence Data Center instances thông qua Personal Access Token authentication. Single server architecture với 11 essential tools.

## Tech Stack
- **Language**: TypeScript với strict mode
- **Runtime**: Node.js 18+ với ES modules
- **Protocol**: Model Context Protocol (MCP) SDK
- **APIs**: Confluence Server/Data Center REST API v1
- **Authentication**: Personal Access Token chỉ
- **Build System**: TypeScript compiler (tsc)
- **HTTP Client**: Axios với SSL support
- **Validation**: Zod schemas
- **Environment**: dotenv

## Current Project Status
- **Overall Progress**: Sprint 1.1 Completed - Infrastructure Ready  
- **Current Sprint**: Sprint 1 (Foundation & Page Management)  
- **Days Remaining**: 17 working days  
- **Tools Completed**: 0/11 tools (Infrastructure hoàn thành)

## Target Tools (11 total)
### Page Discovery & Access (4 tools)
- searchPages: Universal page search với filters
- getPageContent: Page content với labels
- getPageVersions: Page history
- getSpaces: Available spaces

### Page Management (3 tools)  
- createPage: Tạo pages mới
- updatePage: Sửa page content
- deletePage: Xóa pages

### Comment System (4 tools)
- getPageComments: Get comments
- addComment: Add footer comments
- updateComment: Sửa comments
- deleteComment: Xóa comments

## Architecture
- Single server với 11 tools
- Direct API calls, không caching
- PAT authentication chỉ
- Environment-based configuration
- SSL certificate flexibility cho enterprise