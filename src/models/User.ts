import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';
import type { SubscriptionTier } from '@/context/AppContext';

// Define the User schema
const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  image: String,
  profilePicture: {
    url: String,
    uploadedAt: Date,
    lastUpdated: Date
  },
  emailVerified: Date,
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  permissions: {
    canCreateLessons: {
      type: Boolean,
      default: true
    },
    canShareLessons: {
      type: Boolean,
      default: true
    },
    canAccessPremiumFeatures: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    expiresAt: Date,
    features: [String],
    aiCreditsRemaining: {
      type: Number,
      default: 5
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
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

UserSchema.index({ email: 1 });
UserSchema.index({ 'subscription.tier': 1 });

export default models.User || model('User', UserSchema); 