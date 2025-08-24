# Suggested Commands cho Development

## Build và Development Commands
```bash
# Build project
npm run build

# Development mode với watch
npm run dev

# Start server
npm run start

# Clean build directory
npm run clean
```

## Testing Commands
- **Chưa có test scripts** được định nghĩa trong package.json
- Cần thiết lập testing framework khi implement tools
- Integration testing sẽ cần Confluence Data Center instance

## Linting và Formatting Commands
- **Chưa có linting tools** được cấu hình
- TypeScript compiler với strict mode làm basic validation
- Có thể cần ESLint/Prettier setup sau này

## Git Commands
- Sử dụng conventional commits: `type: description`
- **Không sử dụng emoji** trong commit messages
- **Không thêm Claude Code info** trong commits
- Ví dụ: `feat: add searchPages tool`, `fix: resolve SSL certificate handling`

## Environment Setup
```bash
# Copy example environment
cp .env.example .env

# Edit với actual Confluence details
# CONFLUENCE_BASE_URL, CONFLUENCE_PERSONAL_ACCESS_TOKEN
```

## MCP Server Usage
```bash
# Chạy server trong MCP client
node build/index.js

# Hoặc sau khi build
npm start
```

## System Commands (macOS)
- `ls`, `cd`, `grep`, `find` - standard Unix commands
- `git` cho version control
- `node`, `npm` cho Node.js ecosystem