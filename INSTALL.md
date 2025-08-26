# Confluence Data Center MCP Server Installation Guide

> **Production-Ready Confluence Data Center Integration** - Connect AI assistants to Confluence Data Center with comprehensive page management tools

## System Requirements

- macOS 10.15+ or Windows 10+ or Linux
- Node.js 16+ (for running the MCP server)
- Confluence Data Center instance with Personal Access Token support
- MCP-compatible client (Claude Desktop, Cline, Cursor, or other MCP clients)

## Installation Methods

### 🚀 Method 1: NPM Installation (Recommended)

**Quick install from npm registry:**

```bash
npm install -g confluence-dc-mcp-server
```

**That's it!** The binary will be available globally. Continue to [Step 2: Get Confluence Personal Access Token](#step-2-get-confluence-personal-access-token) below.

### 🔧 Method 2: Installation from Source

**For development or customization:**

#### Prerequisites Check

Verify Git and Node.js are installed:

```bash
git --version
node --version
npm --version
```

#### Step 1: Clone Repository

```bash
git clone https://github.com/phuc-nt/confluence-dc-mcp-server.git
cd confluence-dc-mcp-server
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Build the Project

```bash
npm run build
```

**The server is ready at `dist/index.js`.**

## Step 2: Get Confluence Personal Access Token

### Create Personal Access Token in Data Center

1. **Log into your Confluence Data Center instance**
2. **Navigate to User Profile**:
   - Click your profile picture in the top-right corner
   - Select "Profile" or "Personal Settings"
3. **Access Personal Access Tokens**:
   - Look for "Personal Access Tokens" in the sidebar or settings menu
   - Click "Create token"
4. **Configure Token**:
   - Give it a descriptive name (e.g., "MCP Server Integration")
   - Set appropriate expiration (recommend 1 year for production)
   - Copy and securely store the token immediately
5. **Get Your Base URL**:
   - Your base URL format: `https://your-confluence-dc.company.com`
   - Include the context path if any (e.g., `/confluence`)

### Required Permissions

Make sure your account has these Confluence permissions:
- **View Pages**: Read page content and metadata
- **Create Pages**: Add new pages to spaces
- **Edit Pages**: Update existing page content and titles
- **Manage Comments**: Add, edit, and delete comments
- **Search Content**: Access search and discovery features
- **Space Access**: Access to relevant spaces for operations

## Step 3: Configure Your AI Client

### Configuration Format

**Important:** Use the following format for reliable MCP connections:

```json
{
  "mcpServers": {
    "server-name": {
      "disabled": false,
      "timeout": 60,
      "type": "stdio", 
      "command": "node",
      "args": ["/path/to/server/dist/index.js"],
      "env": { /* environment variables */ }
    }
  }
}
```

**Key points:**
- Use `"command": "node"` with `"args": ["/full/path/to/dist/index.js"]` format
- Include `"type": "stdio"` and `"timeout": 60` for stability  
- Set `"disabled": false` to ensure server is active
- Use absolute paths for the `dist/index.js` file

### Deployment Configuration

### 🔧 Complete Confluence Data Center Integration

**Recommended configuration with all 11 tools (NPM Installation):**

```json
{
  "mcpServers": {
    "confluence-dc": {
      "disabled": false,
      "timeout": 60,
      "type": "stdio",
      "command": "node",
      "args": ["/opt/homebrew/bin/confluence-dc-mcp-server"],
      "env": {
        "CONFLUENCE_BASE_URL": "https://your-confluence-dc.company.com",
        "CONFLUENCE_PAT": "your-personal-access-token"
      }
    }
  }
}
```

**For source installation:**

```json
{
  "mcpServers": {
    "confluence-dc": {
      "disabled": false,
      "timeout": 60,
      "type": "stdio",
      "command": "node",
      "args": ["/full/path/to/confluence-dc-mcp-server/dist/index.js"],
      "env": {
        "CONFLUENCE_BASE_URL": "https://your-confluence-dc.company.com",
        "CONFLUENCE_PAT": "your-personal-access-token"
      }
    }
  }
}
```

> **⭐ Best Practice:** Always use the `"command": "node"` with `"args": [...]` format for maximum compatibility across all MCP clients and platforms.

### Configuration Parameters Explained

**Required Environment Variables:**

- `CONFLUENCE_BASE_URL`: Your Confluence Data Center base URL (e.g., `https://confluence.company.com` or `https://confluence.company.com/confluence`)
- `CONFLUENCE_PAT`: Your Personal Access Token from step 2

**Optional Environment Variables:**

- `MCP_SERVER_NAME`: Custom server name (default: "confluence-dc-mcp-server")
- `MCP_SERVER_VERSION`: Custom version (default: "1.0.0")

### Supported MCP Clients

This server works with all major MCP clients:

- **✅ Claude Desktop** - Use the configuration above
- **✅ Cline** - Use the same configuration format
- **✅ Cursor** - Use the same configuration format  
- **✅ Other MCP clients** - Use the same configuration format

### Find Your Installation Path 

**After NPM installation:**

```bash
which confluence-dc-mcp-server
```

**Expected paths by OS:**

**macOS (Homebrew Node):**
```json
"args": ["/opt/homebrew/bin/confluence-dc-mcp-server"]
```

**macOS/Linux (System Node):**
```json
"args": ["/usr/local/bin/confluence-dc-mcp-server"]
```

**Windows:**
```json
"args": ["C:\\Users\\YourName\\AppData\\Roaming\\npm\\confluence-dc-mcp-server.cmd"]
```

**After building from source:**

Get the absolute path to your installation:

```bash
# From your project directory
pwd
# Example output: /Users/username/confluence-dc-mcp-server
```

Use this path in your configuration:
```json
"args": ["/Users/username/confluence-dc-mcp-server/dist/index.js"]
```

## Step 4: Environment Configuration

### Option 1: Environment Variables (Recommended)

Set environment variables in your MCP client configuration as shown above.

### Option 2: .env File (Development)

For development, create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
CONFLUENCE_BASE_URL=https://your-confluence-dc.company.com
CONFLUENCE_PAT=your-personal-access-token
```

## Step 5: Verify Installation

### Test MCP Server Directly

```bash
# Test the server with environment variables
CONFLUENCE_BASE_URL=https://your-confluence-dc.company.com CONFLUENCE_PAT=your-token node dist/index.js
```

You should see output showing tools registered successfully:

```
[ConfluenceDCMCPServer] INFO: Starting confluence-dc-mcp-server v1.0.0
[ConfluenceDCMCPServer] INFO: ✅ Connected to Confluence Data Center successfully
[ConfluenceDCMCPServer] INFO: confluence-dc-mcp-server started successfully on stdio transport
```

### Test Connection to Confluence

The server includes built-in connection testing tools:

- **health-check**: Basic server health validation
- **connection-test**: Confluence API connection verification

### Test with Your AI Client

After restarting your AI client, test with questions like:

- "List all spaces in my Confluence workspace"
- "Search for pages containing 'documentation' in the DEV space"
- "Create a new page called 'Test Page' in the DEMO space"
- "Get the content of page ID 123456"
- "Show me the version history of page 123456"
- "Add a comment to page 123456 saying 'Great work!'"

## 🎉 Installation Complete!

Your Confluence Data Center MCP Server is now ready with **11 production-ready tools** and **100% functional success rate**.

**What you can do now:**

### 📄 Page Management
- Create and manage pages with natural language
- Update page content and titles safely with version control
- Delete pages when no longer needed
- Explore available spaces and their structure

### 🔍 Search & Discovery  
- Search your Confluence content with advanced CQL queries
- Find pages by title, content, or space
- Access page version history for tracking changes
- Discover content across your entire workspace

### 💬 Comment Collaboration
- Retrieve page comments and discussion threads
- Add comments with support for reply threading
- Edit existing comments to update feedback
- Remove comments when necessary

### 🤖 AI Integration Workflows
- **Content Creation**: "Create a meeting notes template in the TEAM space"
- **Content Search**: "Find all pages about API documentation from last month" 
- **Version Control**: "Check what changed in the user guide since version 3"
- **Team Collaboration**: "Add a review request comment to the project proposal"

## 🔧 Troubleshooting

### Common Issues

**Connection Errors:**
- Verify your `CONFLUENCE_BASE_URL` is correct and accessible
- Check your Personal Access Token is valid and not expired
- Ensure your account has necessary permissions

**SSL Certificate Issues:**
- For self-signed certificates, the server includes SSL handling
- Check firewall and network connectivity to your Data Center instance

**MCP Client Issues:**
- Restart your AI client after configuration changes
- Verify the path to `dist/index.js` is correct and absolute
- Check the server logs for detailed error messages

### Getting Help

**Need help?** Check our [GitHub repository](https://github.com/phuc-nt/confluence-dc-mcp-server) for:
- Troubleshooting guides
- Issue tracking and support
- Feature requests and contributions

**Ready to explore?** Start with simple commands like _"List all my Confluence spaces"_ or _"Search for pages about project planning"_.

---

**✅ Production-ready Confluence Data Center integration achieved with comprehensive collaboration tools!**