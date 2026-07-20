import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { sendResponse } from '../helpers/sendResponse.js';

/**
 * Hàm tạo middleware upload ảnh linh hoạt để tái sử dụng nhiều nơi
 * @param {string} folderName - Tên thư mục trên Cloudinary
 * @returns Hàm trả về một middleware có thể xử lý file
 */
const createUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `TravelokaClone/${folderName}`, // Lưu trên Cloudinary theo thư mục
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
  });

  // Bộ lọc loại bỏ những file không phải là hình ảnh
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Chỉ cho phép tải lên các định dạng hình ảnh (jpg, png, webp)',
        ),
        false,
      );
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file là 5MB
    },
  });

  // Trả về một hàm Wrapper đóng gói Multer để có thể dùng hàm sendResponse báo lỗi
  return (fieldName) => (req, res, next) => {
    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Bắt lỗi kích thước file từ Multer
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendResponse(res, 400, null, false, [
            'Kích thước ảnh quá lớn, tối đa cho phép là 5MB',
          ]);
        }
        return sendResponse(res, 400, null, false, [
          err.message || 'Lỗi xử lý file từ Multer',
        ]);
      } else if (err) {
        // Bắt lỗi fileFilter (không phải hình ảnh) hoặc lỗi Cloudinary chưa cấu hình
        console.error('Lỗi Upload:', err); // Log ra console để dễ debug
        const errMsg =
          err.message ||
          err.toString() ||
          'Lỗi hệ thống khi tải ảnh lên Cloudinary. Vui lòng kiểm tra lại cấu hình .env';
        return sendResponse(res, 400, null, false, [errMsg]);
      }

      // Check nếu người dùng không chọn file (Bỏ qua bước bắt lỗi này để cho phép update các field text khác)
      // if (!req.file) {
      //   return sendResponse(res, 400, null, false, ['Vui lòng chọn một file ảnh để tải lên']);
      // }

      next();
    });
  };
};

// Khởi tạo sẵn các middleware cho các mục đích cụ thể
export const uploadAvatar = createUploader('Avatars');
export const uploadPropertyImage = createUploader('Properties');
export const uploadRoomImage = createUploader('Rooms');
