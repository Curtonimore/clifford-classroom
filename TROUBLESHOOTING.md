# Troubleshooting Guide for Clifford Classroom

This guide contains solutions for common issues you might encounter when running the Clifford Classroom application.

## Next.js Server Crashes

If the Next.js development server keeps crashing, try these steps:

1. **Use the stable development script**:
   ```bash
   npm run dev:stable
   ```
   This script includes better error handling and memory management.

2. **Check the logs for specific errors**:
   ```bash
   cat dev-server.log
   ```
   This file contains detailed logs that can help diagnose issues.

3. **Clear Node.js cache**:
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   ```

4. **Update dependencies**:
   ```bash
   npm update
   ```

5. **Remove and reinstall node_modules**:
   ```bash
   rm -rf node_modules
   npm install
   ```

## MongoDB Connection Issues

If you're having issues connecting to MongoDB:

1. **Check MongoDB Atlas IP whitelist**:
   Make sure your current IP address is added to the MongoDB Atlas Network Access list.

2. **Run the connectivity checker**:
   ```bash
   node scripts/check-mongodb-connectivity.js
   ```

3. **Check your .env.local file**:
   Make sure your MongoDB connection string is correct.

4. **Test with a simplified connection**:
   ```bash
   node scripts/test-mongodb-connection.js
   ```

## Authentication Issues

If you're having problems with authentication:

1. **Use local admin setup**:
   Visit http://localhost:3000/admin/setup-local 
   Secret key: `make-me-admin-now`

2. **Check Google OAuth configuration**:
   Make sure your Google client ID and secret are correct in .env.local.

3. **Clear browser cookies and local storage**:
   This can help if you have stale authentication data.

## Styled-JSX Issues

If you're seeing error messages about styled-jsx:

1. **Reinstall styled-jsx**:
   ```bash
   npm uninstall styled-jsx
   npm install styled-jsx@5.1.1 --save-exact
   ```

2. **Clear Next.js build cache**:
   ```bash
   rm -rf .next
   ```

3. **Rebuild the application**:
   ```bash
   npm run build
   ```

## System Resource Issues

If your system is running out of memory:

1. **Adjust memory allocation**:
   Edit the `MAX_OLD_SPACE_SIZE` value in `scripts/start-dev-safe.js` to match your system's capabilities.

2. **Close other applications** before running the dev server.

3. **Monitor system resources** while running the application.

## When All Else Fails

If you've tried everything and still have issues:

1. **Check the GitHub repository issues** for similar problems.

2. **Try running with minimal configuration**:
   ```bash
   NODE_ENV=production next start -p 3000
   ```

3. **Consider upgrading/downgrading Next.js version** if you're experiencing compatibility issues. 