import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

// Define attachments sub-schema for better file management
const AttachmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['document', 'image', 'presentation', 'spreadsheet', 'other'],
    default: 'document'
  },
  fileSize: Number,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Define the LessonPlan schema
const LessonPlanSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  audience: String,
  time: String,
  topic: String,
  objectives: String,
  content: {
    type: String,
    required: true
  },
  // Improved file management
  fileUrl: String, // Kept for backward compatibility
  attachments: [AttachmentSchema],
  // Metadata for better organization
  metadata: {
    gradeLevel: String,
    timeEstimate: String,
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  // Sharing and collaboration
  sharedWith: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    accessLevel: {
      type: String,
      enum: ['read', 'edit'],
      default: 'read'
    }
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add compound indexes for better query performance
LessonPlanSchema.index({ user: 1, subject: 1 });
LessonPlanSchema.index({ subject: 1, isPublic: 1 });
LessonPlanSchema.index({ tags: 1 });
LessonPlanSchema.index({ 'sharedWith.userId': 1 });

export default models.LessonPlan || model('LessonPlan', LessonPlanSchema); 