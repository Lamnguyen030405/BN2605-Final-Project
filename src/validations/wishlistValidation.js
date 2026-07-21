import Joi from 'joi';

export const wishlistSchema = Joi.object({
  property_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'property_id phải là định dạng ObjectId hợp lệ',
      'any.required': 'property_id là bắt buộc',
    }),
});
