import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

// Simple file system storage for demo purposes
const saveImageToFileSystem = async (imageBuffer: Buffer, userId: string): Promise<string> => {
  try {
    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate a unique filename
    const filename = `${userId}-${uuidv4()}.jpg`;
    const filePath = path.join(uploadDir, filename);
    
    // Write the file
    fs.writeFileSync(filePath, imageBuffer);
    
    // Return the public URL
    return `/uploads/profile-images/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user ID
    const userId = session.user.id;
    
    // Parse form data
    const formData = await request.formData();
    const displayName = formData.get('displayName') as string;
    
    // Validate display name
    if (!displayName || displayName.trim().length === 0) {
      return NextResponse.json(
        { message: 'Display name is required' },
        { status: 400 }
      );
    }
    
    // Initialize response data
    const responseData: { name: string; imageUrl?: string | null } = {
      name: displayName
    };
    
    // Handle profile image
    const profileImage = formData.get('profileImage') as Blob | null;
    const removeImage = formData.get('removeImage') === 'true';
    
    if (profileImage) {
      // Convert blob to buffer
      const buffer = Buffer.from(await profileImage.arrayBuffer());
      
      // Save image to file system (or you can use a cloud storage service)
      const imageUrl = await saveImageToFileSystem(buffer, userId);
      responseData.imageUrl = imageUrl;
    } else if (removeImage) {
      // Set to null to remove the image
      responseData.imageUrl = null;
    }
    
    // In a real application, you would update the user record in your database here
    // For this example, we'll just return the updated data for the client to update the session
    
    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
} 