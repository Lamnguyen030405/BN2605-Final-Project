import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String },
    category: {
      type: String,
      enum: [
        'basic',
        'facility',
        'service',
        'safety',
        'entertainment',
        'other',
      ],
      default: 'basic',
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
    versionKey: false,
  }
);

export const Amenity = mongoose.model('Amenity', amenitySchema);
