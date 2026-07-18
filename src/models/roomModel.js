import mongoose from 'mongoose';

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
  },
  {
    versionKey: false,
  }
);

export const Room = mongoose.model('Room', roomSchema);
