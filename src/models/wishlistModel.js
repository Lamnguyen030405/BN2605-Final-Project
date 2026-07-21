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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'added_at',
      updatedAt: false,
    },
    versionKey: false,
  },
);

wishlistSchema.index({ user_id: 1, property_id: 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
