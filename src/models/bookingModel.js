import mongoose from 'mongoose';

const bookingRoomSchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    price_snapshot: { type: Number, required: true },
    nights: { type: Number, default: 1 },
  },
  { _id: false },
);

const bookingTicketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    visit_date: { type: Date, required: true },
    quantity: { type: Number, default: 1 },
    price_snapshot: { type: Number, required: true },
  },
  { _id: false },
);

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: [
        'credit_card',
        'debit_card',
        'bank_transfer',
        'e_wallet',
        'cash',
        'voucher',
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    transaction_ref: { type: String },
    gateway: { type: String },
    paid_at: { type: Date },
    refunded_at: { type: Date },
    refund_amount: { type: Number },
    note: { type: String },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
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
    booking_type: {
      type: String,
      enum: ['hotel', 'attraction'],
      required: true,
    },
    check_in: { type: Date, required: true },
    check_out: { type: Date },
    guests: { type: Number, default: 1 },
    total_price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    final_price: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'checked_in',
        'completed',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    special_requests: { type: String },
    cancelled_at: { type: Date },
    cancel_reason: { type: String },
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

    // Subdocuments nhúng vào Booking
    rooms: [bookingRoomSchema],
    tickets: [bookingTicketSchema],
    payment: paymentSchema,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versionKey: false,
  },
);

export const Booking = mongoose.model('Booking', bookingSchema);
