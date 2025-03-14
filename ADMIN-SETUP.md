# Admin Setup Guide

This document provides instructions for setting up administrator access in the application. Admin users have access to special features such as the admin dashboard, user management, and content moderation.

## Setup Methods

There are two ways to set up an admin user:

1. **Automated Setup Page**: Visit the `/force-admin` page on your deployed application
2. **Environment Variables + API**: Configure environment variables and use the API endpoint

## Method 1: Using the Force Admin Page

1. **Deploy your application** to Vercel or your preferred hosting platform
2. **Set the environment variables**:
   - `ADMIN_EMAILS`: Comma-separated list of emails that are allowed to be admins
   - `NEXT_PUBLIC_ADMIN_EMAILS`: Same as above, but for client-side verification
3. **Visit** `/force-admin` on your deployed application (e.g., `https://your-app.vercel.app/force-admin`)
4. **Sign in** with an email that's included in your `ADMIN_EMAILS` list
5. **Click** the "Assign Admin Role" button
6. **Sign out and sign back in** to apply the changes
7. You should now have access to the admin dashboard at `/admin/dashboard`

## Method 2: Using Environment Variables and API

### Step 1: Set Up Environment Variables

You need to set the following environment variables:

- `ADMIN_EMAILS`: Comma-separated list of emails that should have admin access
- `NEXT_PUBLIC_ADMIN_EMAILS`: Same value, used for client-side verification

For Vercel deployments, use our helper script:

```bash
# Make the script executable (if not already)
chmod +x vercel-admin-setup.js

# Run the script
./vercel-admin-setup.js
```

Or manually set them:

```bash
vercel env add ADMIN_EMAILS
vercel env add NEXT_PUBLIC_ADMIN_EMAILS
```

### Step 2: Make API Request to Set Admin

Make a POST request to the `/api/admin/make-admin` endpoint:

```javascript
// Example code using fetch API
const response = await fetch('/api/admin/make-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
});

const data = await response.json();
console.log(data); // Should show success message
```

Note: You must be logged in with an email that matches one in the `ADMIN_EMAILS` environment variable.

## Troubleshooting

If you encounter issues with admin access:

### No Users Showing in Admin Dashboard

1. **Check MongoDB Connection**: Ensure your application can connect to MongoDB
2. **Verify Environment Variables**: Make sure `MONGODB_URI` and `ADMIN_EMAILS` are correctly set
3. **Check Production Logs**: Look at your Vercel logs for any connection errors
4. **User Database Collection**: Ensure the `users` collection exists in your MongoDB database

### Admin Access Not Working

1. **Session Issues**: Sign out and sign back in after becoming an admin
2. **Check User Document**: Verify that your user document in MongoDB has `role: "admin"`
3. **Environment Variables**: Make sure `ADMIN_EMAILS` includes your email address
4. **API Errors**: Check browser console for any errors when calling the admin API

### MongoDB Connection Issues

If MongoDB connection is failing in production:

1. **IP Allowlist**: Ensure your MongoDB Atlas IP allowlist includes `0.0.0.0/0` (or Vercel's IP ranges)
2. **Connection String**: Verify your `MONGODB_URI` is correctly formatted and includes username/password
3. **Database Name**: Ensure the correct database name is included in your connection string

## Advanced: Creating a MongoDB Index for User Lookup

For better performance, create an index on the `email` field:

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```

This will ensure faster lookup of users by email and enforce email uniqueness.

## Additional Resources

- [Next.js Authentication Documentation](https://next-auth.js.org/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables) 