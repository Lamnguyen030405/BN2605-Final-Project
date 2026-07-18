// Helper function để chuẩn hóa format trả về cho toàn bộ API
const sendResponse = (res, statusCode, data, isSuccess, errors = []) => {
  return res.status(statusCode).json({
    data,
    isSuccess,
    errors,
  });
};

export { sendResponse };
