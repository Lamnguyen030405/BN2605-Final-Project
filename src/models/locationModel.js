import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, default: 'Vietnam' },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    versionKey: false,
  }
);

export const Location = mongoose.model('Location', locationSchema);
