import mongoose from 'mongoose';
import 'dotenv/config'; // Tự động tải biến môi trường từ .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch {
    process.exit(1);
  }
};

export default connectDB;
