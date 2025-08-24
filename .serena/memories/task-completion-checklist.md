# Task Completion Checklist

## Khi Hoàn Thành Task

### 1. Code Quality Checks
```bash
# Build thành công
npm run build

# Kiểm tra TypeScript errors
tsc --noEmit
```

### 2. Testing (khi có)
- Chưa có test framework được setup
- Cần manual testing với actual Confluence Data Center instance
- Integration testing cho API endpoints

### 3. Documentation Updates
- Cập nhật `docs/01_plan/project-roadmap.md` cho major progress
- Cập nhật sprint files trong `docs/02_implement/` cho daily progress
- **KHÔNG SỬA** `docs/00_context/` trừ khi được approve

### 4. Git Commit Guidelines
```bash
# Stage changes
git add .

# Commit theo convention (KHÔNG emoji, KHÔNG Claude info)
git commit -m "feat: implement searchPages tool"
git commit -m "fix: resolve SSL certificate handling"
git commit -m "docs: update sprint 1 progress"
```

### 5. Environment Verification
- Test với actual Confluence Data Center instance
- Verify PAT authentication
- Check SSL certificate handling
- Verify network connectivity

### 6. Error Handling
- Implement proper error messages
- Handle SSL certificate issues
- Handle network connectivity problems
- Handle authentication failures

## Pre-commit Checklist
- [ ] Code compiles successfully
- [ ] No sensitive data committed (PAT tokens, etc.)
- [ ] Proper error handling implemented
- [ ] Documentation updated
- [ ] Commit message follows convention