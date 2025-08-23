# Confluence Data Center MCP Server

A Model Context Protocol server for Confluence Data Center integration using Personal Access Token authentication.

## Status

🚧 **In Development** - Sprint 1.1 (Project Setup)

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Confluence Data Center instance with Personal Access Token access

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Configure your Confluence Data Center connection:

```bash
CONFLUENCE_BASE_URL=https://your-confluence.company.com/confluence
CONFLUENCE_PERSONAL_ACCESS_TOKEN=your-pat-token
CONFLUENCE_VERIFY_SSL=true
```

### Development

```bash
# Build the project
npm run build

# Start development with watch mode
npm run dev

# Run the server
npm start
```

## Features (Planned)

### Sprint 1 - Foundation & Page Management
- ✅ Project setup and infrastructure
- ⏳ Page CRUD operations
- ⏳ Content retrieval with labels
- ⏳ Space discovery

### Sprint 2 - Search & Discovery
- ⏳ Universal page search
- ⏳ Page version history
- ⏳ Error handling standardization

### Sprint 3 - Comments & Production
- ⏳ Comment system (full CRUD)
- ⏳ Content format validation
- ⏳ NPM package distribution

## Personal Access Token Setup

1. Go to your Confluence Data Center instance
2. Navigate to User Profile → Personal Access Tokens
3. Create a new token with required permissions
4. Copy the token to your `.env` file

## Architecture

- **MCP Server**: Model Context Protocol integration
- **API Client**: Confluence Data Center REST API v1
- **Authentication**: Personal Access Token (Bearer)
- **SSL Support**: Configurable certificate verification

## Contributing

This project follows a sprint-based development approach. See `docs/` for detailed implementation plans.

## License

MIT