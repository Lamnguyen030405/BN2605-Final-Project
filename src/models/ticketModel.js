import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quota_per_day: { type: Number },
    valid_days: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
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
  },
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
