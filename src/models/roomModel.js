import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String },
    is_primary: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
  },
  { _id: false },
);

const roomSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    room_number: { type: String },
    room_type: { type: String, required: true },
    description: { type: String },
    price_per_night: { type: Number, required: true },
    max_guests: { type: Number, default: 2 },
    bed_type: { type: String },
    floor: { type: Number },
    is_available: { type: Boolean, default: true },
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
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const Room = mongoose.model('Room', roomSchema);
