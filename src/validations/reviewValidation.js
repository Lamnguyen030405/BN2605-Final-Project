import Joi from 'joi';

export const createReviewSchema = Joi.object({
  booking_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'booking_id phải là định dạng ObjectId hợp lệ',
      'any.required': 'booking_id là bắt buộc',
    }),
  overall_score: Joi.number().min(1).max(10).messages({
    'number.min': 'Điểm phải lớn hơn hoặc bằng 1',
    'number.max': 'Điểm tối đa là 10',
  }),
  cleanliness_score: Joi.number().min(1).max(10).optional(),
  service_score: Joi.number().min(1).max(10).optional(),
  location_score: Joi.number().min(1).max(10).optional(),
  value_score: Joi.number().min(1).max(10).optional(),
  comment: Joi.string().allow('', null).optional(),
}).custom((value, helpers) => {
  const {
    overall_score,
    cleanliness_score,
    service_score,
    location_score,
    value_score,
  } = value;

  // Nếu có bất kỳ điểm thành phần nào, không cần overall_score
  const hasSubScore =
    cleanliness_score || service_score || location_score || value_score;

  if (!overall_score && !hasSubScore) {
    return helpers.message(
      'Bạn phải cung cấp điểm tổng quát (overall_score) hoặc ít nhất một điểm thành phần',
    );
  }

  return value;
});

export const replyReviewSchema = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Nội dung phản hồi không được để trống',
    'any.required': 'Nội dung phản hồi là bắt buộc',
  }),
});

export const updateReviewStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'approved', 'rejected', 'hidden')
    .required()
    .messages({
      'any.required': 'Trạng thái là bắt buộc',
      'any.only': 'Trạng thái không hợp lệ',
    }),
});
