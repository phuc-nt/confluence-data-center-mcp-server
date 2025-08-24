# Tech Stack và Code Conventions

## TypeScript Configuration
- **Target**: ES2022
- **Module**: NodeNext với moduleResolution NodeNext
- **Strict mode**: true
- **ES modules**: với esModuleInterop
- **Output**: build/ directory
- **Root**: src/ directory

## Code Style và Patterns
### Import/Export Patterns
- ES modules với `.js` extensions trong imports
- Named exports preferred
- Path structure: `from './tools/confluence/index.js'`

### Naming Conventions
- **Files**: kebab-case (e.g., `search-pages.ts`, `confluence-api.ts`)
- **Directories**: kebab-case (e.g., `tools/confluence/`)
- **Functions**: camelCase (e.g., `executeSearchPages`)
- **Interfaces**: PascalCase (e.g., `ConfluenceDataCenterConfig`)
- **Constants**: camelCase hoặc UPPER_SNAKE_CASE cho env vars

### File Structure Patterns
```
src/
├── tools/           # MCP tool implementations
│   └── confluence/  # Confluence-specific tools
├── utils/           # Utility functions
│   ├── confluence-api.ts    # API client
│   ├── error-handler.ts     # Error handling
│   ├── server-context.ts    # Server context
│   └── logger.ts           # Logging utilities
├── schemas/         # Zod validation schemas
│   ├── common.ts    # Common schemas
│   └── confluence.ts # Confluence-specific schemas
└── index.ts         # Main server entry point
```

### Error Handling Pattern
- Custom error classes extending Error
- HTTP status code handling
- SSL certificate error handling
- Network connectivity error handling
- Data Center specific error messages

### Configuration Pattern
- Environment variables với dotenv
- Validation of required config
- SSL verification configurable
- Base URL normalization cho Data Center paths