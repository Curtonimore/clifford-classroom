import mongoose from 'mongoose';
import { Schema, models, model } from 'mongoose';

// Define the AIUsage schema
const AIUsageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  feature: {
    type: String,
    required: true,
    enum: ['lesson_plan', 'worksheet', 'story_generator', 'custom'] 
  },
  creditsUsed: {
    type: Number,
    required: true,
    default: 1
  },
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for better query performance
AIUsageSchema.index({ user: 1, createdAt: -1 });

export default models.AIUsage || model('AIUsage', AIUsageSchema); 