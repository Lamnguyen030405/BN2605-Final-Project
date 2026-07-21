// Helper function để chuẩn hóa format trả về cho toàn bộ API
const sendResponse = (
  res,
  statusCode,
  data,
  isSuccess,
  messagesOrErrors = [],
) => {
  const messagesArray = Array.isArray(messagesOrErrors)
    ? messagesOrErrors
    : [messagesOrErrors];

  const response = {
    data,
    isSuccess,
    message:
      messagesArray.length > 0
        ? messagesArray[0]
        : isSuccess
          ? 'Thành công'
          : 'Đã có lỗi xảy ra',
  };

  if (!isSuccess) {
    response.errors = messagesArray;
  } else {
    response.errors = [];
  }

  return res.status(statusCode).json(response);
};

export { sendResponse };
