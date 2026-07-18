import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    overall_score: { type: Number, required: true, min: 1, max: 10 },
    cleanliness_score: { type: Number, min: 1, max: 10 },
    service_score: { type: Number, min: 1, max: 10 },
    location_score: { type: Number, min: 1, max: 10 },
    value_score: { type: Number, min: 1, max: 10 },
    comment: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'hidden'],
      default: 'approved',
    },
    // Nhúng review_reply trực tiếp
    reply: {
      owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String },
      replied_at: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
    versionKey: false,
  }
);

export const Review = mongoose.model('Review', reviewSchema);
