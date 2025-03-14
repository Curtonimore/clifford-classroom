# Vercel Deployment Guide

This document provides detailed instructions for deploying the application to Vercel with a focus on ensuring a proper MongoDB connection.

## Prerequisites

- A Vercel account
- A MongoDB Atlas account
- The Vercel CLI installed: `npm i -g vercel`
- Your application code ready to deploy

## Step 1: Set Up MongoDB Atlas

1. **Create or Access Your MongoDB Atlas Cluster**
   - Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Navigate to your cluster

2. **Configure Network Access**
   - Go to the "Network Access" tab
   - Add `0.0.0.0/0` to the IP Access List to allow access from anywhere (required for Vercel)
   - Alternatively, add Vercel's IP ranges ([Vercel IP addresses documentation](https://vercel.com/docs/concepts/deployments/regions))

3. **Get Your MongoDB Connection String**
   - Go to the "Databases" tab
   - Click "Connect" button for your cluster
   - Select "Connect your application"
   - Copy the connection string (it will look like: `mongodb+srv://username:<password>@cluster.mongodb.net/mydb?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual database user's password

## Step 2: Configure Vercel Project

1. **Initialize Vercel in Your Project (if not done)**
   ```bash
   vercel login
   vercel
   ```

2. **Set Environment Variables in Vercel**

   Using Vercel CLI:
   ```bash
   vercel env add MONGODB_URI
   ```
   
   Then paste your MongoDB connection string when prompted.

   You can also use our helper script:
   ```bash
   # Add admin emails for admin access
   ./vercel-admin-setup.js
   ```

   Important environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: A random string for NextAuth session encryption
   - `NEXTAUTH_URL`: The URL of your deployed application
   - `ADMIN_EMAILS`: Comma-separated list of admin emails
   - `NEXT_PUBLIC_ADMIN_EMAILS`: Same as above, for client-side verification

3. **Verify Environment Variables**
   ```bash
   vercel env ls
   ```

## Step 3: Deploy Your Application

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Visit Your Deployed Application**
   - The CLI will provide a URL to your deployed application
   - Navigate to this URL in your browser

## Step 4: Verify MongoDB Connection

1. **Check Admin Dashboard**
   - Go to `/admin/dashboard` on your deployed application
   - Use the "Application Settings" tab (using the left navigation)
   - Click "Check MongoDB Connection" under the MongoDB Connection section
   - View the debug information if there are issues

2. **If Users Aren't Showing Up**
   - Visit `/force-admin` on your deployed app
   - Sign in with an email that's in your `ADMIN_EMAILS` list
   - Click the "Assign Admin Role" button
   - Sign out and sign back in
   - Try accessing the admin dashboard again

## Troubleshooting MongoDB Connection Issues

### Problem: "No users found matching your search"

This typically indicates one of these issues:

1. **MongoDB Connection Issue**
   - Check your `MONGODB_URI` value in Vercel
   - Ensure you've included the correct database name
   - Verify your IP allowlist includes `0.0.0.0/0`

2. **Database Permission Issue**
   - Ensure your MongoDB user has read/write access
   - Check if your user has access to the specific database

3. **Missing Users Collection**
   - If the users collection doesn't exist yet, it needs to be created
   - This can be done by:
     - Using the `/force-admin` page to create an admin user
     - Creating it manually in MongoDB Atlas

### Debugging with Vercel Logs

1. **Check Deployment Logs**
   ```bash
   vercel logs your-app-name
   ```

2. **Enable More Verbose Logging**
   - Add `console.log` statements in your database connection code
   - Redeploy your application

### Using MongoDB Compass for Direct Database Inspection

MongoDB Compass provides a GUI to directly view your database:

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB connection string
3. Navigate to the users collection to verify if users exist

## Advanced: Creating a Test User

If you need to manually create a user in the database:

1. Connect to your MongoDB database using MongoDB Compass
2. Navigate to your database
3. If the `users` collection doesn't exist, create it
4. Add a document with the following structure:

```json
{
  "name": "Admin User",
  "email": "your-email@example.com",
  "role": "admin",
  "subscription": {
    "tier": "premium",
    "aiCreditsRemaining": 100,
    "features": ["unlimited_plan_storage", "ai_lesson_plans", "premium_templates"],
    "expiresAt": null
  },
  "createdAt": new Date()
}
```

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/environment-variables)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/) 