# Lambda Deployment Package TODO

## Plan Summary
- Install production dependencies
- Build dist/ folder
- Package into function.zip (lambda.js, package*.json, dist/, node_modules/)
- Exclude src/, tests, dev tools

## Steps
- [x] Step 1: Install production dependencies (`npm ci --production`) ✓
- [x] Step 2: Build project (`npm run build`) ✓
- [x] Step 3: Create function.zip ✓
- [x] Step 4: Verify package contents ✓

**Minimal files:**
- lambda.js
- package.json
- package-lock.json  
- dist/
- node_modules/ (prod only)

