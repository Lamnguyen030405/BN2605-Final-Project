import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: {
      createdAt: 'added_at',
      updatedAt: false,
    },
    versionKey: false,
  }
);

// Tạo Compound Index để đảm bảo 1 User chỉ lưu 1 Property 1 lần[cite: 3]
wishlistSchema.index({ user_id: 1, property_id: 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
