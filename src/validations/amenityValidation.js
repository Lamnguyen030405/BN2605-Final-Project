import Joi from 'joi';

export const createAmenitySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Tên tiện ích không được để trống',
    'any.required': 'Tên tiện ích là bắt buộc',
  }),
  icon: Joi.string().allow('', null).optional(),
  category: Joi.string()
    .valid('basic', 'facility', 'service', 'safety', 'entertainment', 'other')
    .default('basic')
    .messages({
      'any.only': 'Danh mục tiện ích không hợp lệ',
    }),
});
