import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String },
    is_primary: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'hotel',
        'resort',
        'villa',
        'hostel',
        'attraction',
        'theme_park',
        'museum',
        'other',
      ],
      default: 'hotel',
    },
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    base_price: { type: Number, required: true, default: 0 },
    avg_rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
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
    images: [imageSchema],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versionKey: false,
  }
);

export const Property = mongoose.model('Property', propertySchema);
