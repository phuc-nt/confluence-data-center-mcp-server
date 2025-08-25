# NPM Publishing Guide - Confluence Data Center MCP Server

> Complete guide for publishing Confluence Data Center MCP Server to npm registry

## Pre-Publishing Checklist

### ✅ Project Status Verification
- [x] All 11 tools implemented and tested
- [x] Complete documentation created (README, INSTALL, API_REFERENCE)
- [x] Package.json configured for npm publishing
- [x] Build system working (TypeScript → dist/)
- [x] Binary executable permissions set
- [x] .npmignore file created

### ✅ Package Configuration
- [x] Package name: `confluence-dc-mcp-server`
- [x] Version: `1.0.0`
- [x] Main entry: `dist/index.js`
- [x] Binary command: `confluence-dc-mcp-server`
- [x] Files included: dist/, docs, LICENSE
- [x] Repository links configured
- [x] Keywords optimized for discovery

## Publishing Steps

### Step 1: Final Quality Check

**Verify build works:**
```bash
npm run clean
npm run build
```

**Test package contents:**
```bash
npm pack --dry-run
```

**Verify binary executable:**
```bash
ls -la dist/index.js
# Should show: -rwxr-xr-x permissions
```

### Step 2: NPM Registry Setup

**Login to npm (if not already logged in):**
```bash
npm login
```

**Verify npm account:**
```bash
npm whoami
```

**Check package name availability:**
```bash
npm view confluence-dc-mcp-server
# Should return 404 if name is available
```

### Step 3: Version Management

**For initial release (v1.0.0):**
- Current version is already set to 1.0.0
- No version bump needed for first publish

**For future releases:**
```bash
# Patch version (1.0.1) - bug fixes
npm version patch

# Minor version (1.1.0) - new features
npm version minor

# Major version (2.0.0) - breaking changes
npm version major
```

### Step 4: Publishing

**Test publish (dry run):**
```bash
npm publish --dry-run
```

**Actual publish:**
```bash
npm publish
```

**For scoped packages (if needed later):**
```bash
npm publish --access public
```

### Step 5: Post-Publishing Verification

**Verify package is published:**
```bash
npm view confluence-dc-mcp-server
```

**Test global installation:**
```bash
npm install -g confluence-dc-mcp-server
```

**Test binary command:**
```bash
which confluence-dc-mcp-server
confluence-dc-mcp-server --help
```

## Package Information

### What will be published:

**Package size**: ~25.9 KB  
**Unpacked size**: ~128.2 KB  
**Total files**: 47 files

**Included files:**
- `dist/` - Compiled JavaScript and TypeScript definitions
- `README.md` - Project overview and quick start
- `INSTALL.md` - Complete installation guide
- `API_REFERENCE.md` - Tool API documentation
- `LICENSE` - MIT license

**Excluded files (via .npmignore):**
- `src/` - TypeScript source code
- `docs/` - Development documentation
- `sample/` - Sample files
- `node_modules/` - Dependencies
- Development files (.env, .git, etc.)

### NPM Scripts Available After Install

Users will be able to run:
```bash
# Global binary
confluence-dc-mcp-server

# Or with node
node /path/to/package/dist/index.js
```

## Publishing Checklist

### Pre-Publish (Required)
- [ ] `npm run build` - Builds successfully
- [ ] `npm pack --dry-run` - Package contents verified
- [ ] `npm login` - Authenticated to npm registry
- [ ] Version number appropriate for release type
- [ ] All documentation up to date

### Publish Process
- [ ] `npm publish --dry-run` - Test publish
- [ ] `npm publish` - Actual publish
- [ ] Verify on npmjs.com
- [ ] Test global install: `npm install -g confluence-dc-mcp-server`

### Post-Publish (Validation)
- [ ] `npm view confluence-dc-mcp-server` - Package visible on registry
- [ ] `which confluence-dc-mcp-server` - Binary accessible globally
- [ ] Test with AI client configuration
- [ ] Update documentation with npm install instructions

## Troubleshooting

### Common Issues

**Permission Denied:**
```bash
npm login
# Enter your npm credentials
```

**Package Name Taken:**
```bash
npm view confluence-dc-mcp-server
# If exists, consider alternative name or scoped package @username/confluence-dc-mcp-server
```

**Build Errors:**
```bash
npm run clean
npm install
npm run build
```

**Binary Not Executable:**
```bash
chmod +x dist/index.js
# Already handled by build script
```

### Alternative Publishing Options

**Scoped Package (if name conflicts):**
```json
{
  "name": "@phuc-nt/confluence-dc-mcp-server"
}
```

**Private Registry:**
```bash
npm publish --registry https://your-private-registry.com
```

## Success Metrics

After successful publish:
- ✅ Package visible on npmjs.com
- ✅ Global install works: `npm install -g confluence-dc-mcp-server`
- ✅ Binary command available: `confluence-dc-mcp-server`
- ✅ Documentation accessible on npm page
- ✅ AI clients can use the package in MCP configuration

## Next Steps After Publishing

1. **Update Documentation**: Update INSTALL.md to reference npm package
2. **GitHub Release**: Create GitHub release tag matching npm version
3. **Community Engagement**: Share on relevant forums and communities
4. **Version Management**: Set up automated version management for future releases

---

**🚀 Ready to publish your Confluence Data Center MCP Server to npm!**

**Repository**: https://github.com/phuc-nt/confluence-dc-mcp-server  
**NPM Package**: https://npmjs.com/package/confluence-dc-mcp-server (after publishing)