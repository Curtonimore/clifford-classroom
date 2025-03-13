import clientPromise from './mongodb-client';
import connectDB from './mongoose';
import { ObjectId } from 'mongodb';

/**
 * Utility functions for MongoDB operations in Clifford Classroom
 * These functions help maintain clean data operations and handle common database tasks
 */

/**
 * Get a MongoDB collection by name
 * @param collectionName The name of the collection to get
 * @returns The MongoDB collection
 */
export async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(collectionName);
}

/**
 * Clean up orphaned files that aren't associated with any lesson plan
 * Call this periodically to ensure database cleanliness
 */
export async function cleanupOrphanedFiles() {
  await connectDB();
  const client = await clientPromise;
  const db = client.db();
  
  // Get all lesson plans with attachments
  const lessonPlans = await db.collection('lessonplans').find(
    { $or: [{ fileUrl: { $exists: true } }, { attachments: { $exists: true } }] }
  ).toArray();
  
  // Extract all file URLs
  const validFileUrls = new Set();
  lessonPlans.forEach(plan => {
    if (plan.fileUrl) validFileUrls.add(plan.fileUrl);
    if (plan.attachments && Array.isArray(plan.attachments)) {
      plan.attachments.forEach(att => {
        if (att.fileUrl) validFileUrls.add(att.fileUrl);
      });
    }
  });
  
  // Find orphaned files in your storage system here
  // This is a placeholder for your file storage cleanup code
  console.log(`Found ${validFileUrls.size} valid files in database`);
  
  return {
    success: true,
    fileCount: validFileUrls.size
  };
}

/**
 * Update user profile including profile picture
 * @param userId The user ID
 * @param profileData The profile data to update
 * @param profilePictureUrl Optional URL to a new profile picture
 */
export async function updateUserProfile(
  userId: string, 
  profileData: any, 
  profilePictureUrl?: string
) {
  await connectDB();
  const client = await clientPromise;
  const db = client.db();
  
  const updateData: any = { ...profileData };
  
  // If profile picture URL is provided, update it with timestamp
  if (profilePictureUrl) {
    updateData.profilePicture = {
      url: profilePictureUrl,
      lastUpdated: new Date(),
      uploadedAt: new Date()
    };
    // Also update the legacy image field for compatibility
    updateData.image = profilePictureUrl;
  }
  
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: updateData }
  );
  
  return {
    success: true,
    userId,
    updated: true
  };
}

/**
 * Share a lesson plan with another user
 * @param lessonPlanId The lesson plan ID
 * @param sharedWithUserId The user ID to share with
 * @param accessLevel The access level (read or edit)
 */
export async function shareLessonPlan(
  lessonPlanId: string, 
  sharedWithUserId: string, 
  accessLevel: 'read' | 'edit' = 'read'
) {
  await connectDB();
  const client = await clientPromise;
  const db = client.db();
  
  await db.collection('lessonplans').updateOne(
    { _id: new ObjectId(lessonPlanId) },
    { 
      $push: { 
        sharedWith: {
          userId: new ObjectId(sharedWithUserId),
          accessLevel
        }
      }
    }
  );
  
  return {
    success: true,
    lessonPlanId,
    sharedWithUserId,
    accessLevel
  };
}

/**
 * Check if a user has permission to access a resource
 * @param userId The user ID
 * @param resourceType The type of resource (e.g., 'lesson_plan', 'worksheet')
 * @param action The action to perform (e.g., 'create', 'edit', 'delete')
 */
export async function checkUserPermission(
  userId: string,
  resourceType: string,
  action: string
): Promise<boolean> {
  await connectDB();
  const client = await clientPromise;
  const db = client.db();
  
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  
  if (!user) return false;
  
  // Admin always has permission
  if (user.role === 'admin' || (user.permissions && user.permissions.isAdmin)) return true;
  
  // Check subscription tier
  const isPremium = user.role === 'premium' || 
                   (user.subscription && user.subscription.tier === 'premium');
  
  // Check specific permissions
  if (user.permissions) {
    // Check resource-specific permissions
    switch (resourceType) {
      case 'lesson_plan':
        if (action === 'create' && !user.permissions.canCreateLessons) return false;
        if (action === 'share' && !user.permissions.canShareLessons) return false;
        break;
      case 'premium_feature':
        if (!isPremium && !user.permissions.canAccessPremiumFeatures) return false;
        break;
    }
  }
  
  return true;
} 