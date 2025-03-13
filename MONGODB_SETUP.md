# MongoDB Setup for Clifford Classroom

This guide will walk you through setting up MongoDB Atlas for your Clifford Classroom application.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Complete the registration process

## Step 2: Create a Free Cluster

1. Click "Build a Database" or "Create" in your Atlas dashboard
2. Select the "FREE" option (M0 Sandbox)
3. Choose a cloud provider (AWS, Google Cloud, or Azure) and a region closest to you
4. Name your cluster (e.g., "clifford-classroom")
5. Click "Create Cluster" (this will take a few minutes to provision)

## Step 3: Set Up Database Access

1. In the sidebar, click "Database Access"
2. Click "Add New Database User"
3. Create a username and password (remember these for your .env file)
4. For user privileges, select "Read and write to any database"
5. Click "Add User"

## Step 4: Set Up Network Access

1. In the sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, you should restrict this to your application's IP addresses
4. Click "Confirm"

## Step 5: Get Your Connection String

1. In the sidebar, click "Database" and then "Connect"
2. Click "Connect your application"
3. Select "Node.js" and the latest version
4. Copy the connection string (it will look like `mongodb+srv://username:<password>@cluster.mongodb.net/`)
5. Replace `<password>` with your database user's password
6. Add the database name to the end: `mongodb+srv://username:password@cluster.mongodb.net/clifford-classroom?retryWrites=true&w=majority`

## Step 6: Update Environment Variables

1. Create a `.env.local` file at the root of your project (copy from example.env.local)
2. Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clifford-classroom?retryWrites=true&w=majority
   ```
3. Replace `username`, `password`, and `cluster` with your actual values

## Step 7: Test Your Connection

1. Start your application with `npm run dev`
2. Try to log in and create a lesson plan
3. Save the lesson plan to verify the MongoDB connection is working

## Data Collections

Your MongoDB will automatically create these collections:

- `users`: Stores user profiles and authentication data
  - Enhanced with profile picture management
  - Includes permissions system for fine-grained access control
  - Stores user preferences and settings

- `lessonplans`: Stores saved lesson plans
  - Includes attachments and file management
  - Supports sharing and collaboration features
  - Has metadata for better organization

- `aiusages`: Tracks AI credit usage
  - Monitors feature usage to manage subscription limits

## Utility Functions

The application includes MongoDB utility functions to help with common operations:

- **Profile Management**: Update user profiles and handle profile pictures
- **File Management**: Attach files to lesson plans and clean up orphaned files
- **Permissions**: Check user permissions for different actions
- **Sharing**: Share lesson plans with other users with specific access levels

## Monitoring Your Database

1. In your MongoDB Atlas dashboard, you can monitor database performance, storage usage, and more
2. The free tier gives you 512MB of storage, which is plenty for development and small-scale use

## Need Help?

If you encounter any issues, you can:
1. Check the MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
2. Check the MongoDB Node.js driver documentation: https://docs.mongodb.com/drivers/node/
3. Check the logs in your Next.js application 

## Testing MongoDB Connection

You can use these test scripts to verify your MongoDB connection:

```bash
# Test basic connection
node scripts/test-mongodb-connection.js

# Test user model and data
node scripts/tests/test-mongo.js

# Test database operations
node scripts/test-db-operation.js
``` 