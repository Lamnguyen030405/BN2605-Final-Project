import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, default: 'Vietnam' },
    latitude: { type: Number },
    longitude: { type: Number },
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
    versionKey: false
  }
);

export const Location = mongoose.model('Location', locationSchema);
