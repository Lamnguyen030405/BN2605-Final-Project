// src/config/database.js
import mongoose from 'mongoose';
import 'dotenv/config'; // Tự động tải biến môi trường từ .env

const connectDB = async () => {
  try {
    // Cấu hình kết nối chuẩn mực của Mongoose
    console.log('✅ MongoDB URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🚀 Đã thiết lập kết nối thành công tới MongoDB Atlas!');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
    // Ngắt tiến trình Node.js nếu Database sập (Fail-fast mechanism)
    process.exit(1);
  }
};

export default connectDB;
