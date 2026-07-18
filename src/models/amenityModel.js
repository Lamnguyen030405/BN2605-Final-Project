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
  },
  {
    versionKey: false,
  }
);

export const Amenity = mongoose.model('Amenity', amenitySchema);
