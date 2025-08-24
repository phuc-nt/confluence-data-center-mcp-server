# Codebase Structure và Organization

## Root Level Structure
```
confluence-dc-mcp-server/
├── src/                    # Source code
├── docs/                   # Documentation
│   ├── 00_context/        # Technical specs, requirements (KHÔNG SỬA)
│   ├── 01_plan/           # Project roadmap, timeline
│   └── 02_implement/      # Sprint implementation tasks
├── build/                 # Compiled TypeScript output
├── .serena/              # Serena MCP cache
├── package.json          # Dependencies và scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Environment template
└── CLAUDE.md            # Project instructions
```

## Source Code Organization

### Current Implementation Status
- **Infrastructure**: ✅ Completed
- **Tools**: 0/11 implemented
- **API Client**: Basic structure
- **Error Handling**: Basic patterns
- **Schemas**: Common và Confluence schemas

### Key Files
- `src/index.ts`: Main MCP server entry point
- `src/utils/confluence-api.ts`: Data Center API client
- `src/utils/error-handler.ts`: Error handling utilities
- `src/schemas/confluence.ts`: Confluence-specific types
- `src/tools/`: Tool implementations (chưa có tools)

## Documentation Structure
- **00_context/**: Requirements, implementation guide, API reference (stable)
- **01_plan/**: Project roadmap, current status
- **02_implement/**: Sprint-by-sprint tasks

## Configuration Files
- TypeScript: strict mode, ES2022, NodeNext modules
- Package.json: MCP SDK, axios, dotenv, zod dependencies
- Environment: Confluence URL, PAT, SSL verification