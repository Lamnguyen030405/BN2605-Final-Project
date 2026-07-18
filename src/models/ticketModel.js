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
    is_active: { type: Boolean, default: true },
  },
  {
    versionKey: false,
  }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
