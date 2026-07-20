import { sendResponse } from '../helpers/sendResponse.js';
import Joi from 'joi';

/**
 * Middleware để validate request đầu vào sử dụng Joi
 * @param {Object} schema - Joi schema (vd: { body: Joi.object(...), query: Joi.object(...), params: Joi.object(...) })
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = {};
  const requestObjects = {};

  ['body', 'query', 'params'].forEach((key) => {
    if (schema[key]) {
      validSchema[key] = schema[key];
      requestObjects[key] = req[key];
    }
  });

  const { error, value } = Joi.object(validSchema).validate(requestObjects, {
    abortEarly: false, // Trả về tất cả các lỗi thay vì chỉ trả về lỗi đầu tiên
    stripUnknown: true, // Xóa bỏ các trường không được định nghĩa trong schema (bảo mật)
  });

  if (error) {
    const errorMessages = error.details.map((detail) =>
      detail.message.replace(/"/g, ''),
    );
    return sendResponse(res, 400, null, false, errorMessages);
  }

  // Cập nhật lại request object với giá trị đã được validate
  Object.assign(req, value);
  return next();
};

export { validate };
