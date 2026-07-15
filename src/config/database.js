// src/config/database.js
import mongoose from 'mongoose';
import 'dotenv/config'; // Tự động tải biến môi trường từ .env

const connectDB = async () => {
  try {
    // Cấu hình kết nối chuẩn mực của Mongoose
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    // Ngắt tiến trình Node.js nếu Database sập (Fail-fast mechanism)
    process.exit(1);
  }
};

export default connectDB;
