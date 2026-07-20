import Joi from 'joi';

const createLocationSchema = {
  body: Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Tên địa điểm không được để trống',
      'any.required': 'Vui lòng cung cấp tên địa điểm',
    }),
    city: Joi.string().required().messages({
      'string.empty': 'Thành phố không được để trống',
      'any.required': 'Vui lòng cung cấp thành phố',
    }),
    province: Joi.string().required().messages({
      'string.empty': 'Tỉnh/Thành phố trực thuộc không được để trống',
      'any.required': 'Vui lòng cung cấp tỉnh',
    }),
    country: Joi.string().default('Vietnam'),
    latitude: Joi.number().min(-90).max(90).messages({
      'number.base': 'Vĩ độ phải là một số',
      'number.min': 'Vĩ độ không hợp lệ (>= -90)',
      'number.max': 'Vĩ độ không hợp lệ (<= 90)',
    }),
    longitude: Joi.number().min(-180).max(180).messages({
      'number.base': 'Kinh độ phải là một số',
      'number.min': 'Kinh độ không hợp lệ (>= -180)',
      'number.max': 'Kinh độ không hợp lệ (<= 180)',
    }),
  }),
};

const updateLocationSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.hex': 'ID địa điểm không hợp lệ',
      'string.length': 'ID địa điểm không hợp lệ',
      'any.required': 'Vui lòng cung cấp ID địa điểm',
    }),
  }),
  body: Joi.object({
    name: Joi.string().messages({
      'string.empty': 'Tên địa điểm không được để trống',
    }),
    city: Joi.string().messages({
      'string.empty': 'Thành phố không được để trống',
    }),
    province: Joi.string().messages({
      'string.empty': 'Tỉnh/Thành phố trực thuộc không được để trống',
    }),
    country: Joi.string(),
    latitude: Joi.number().min(-90).max(90).messages({
      'number.base': 'Vĩ độ phải là một số',
      'number.min': 'Vĩ độ không hợp lệ (>= -90)',
      'number.max': 'Vĩ độ không hợp lệ (<= 90)',
    }),
    longitude: Joi.number().min(-180).max(180).messages({
      'number.base': 'Kinh độ phải là một số',
      'number.min': 'Kinh độ không hợp lệ (>= -180)',
      'number.max': 'Kinh độ không hợp lệ (<= 180)',
    }),
  }).min(1).messages({
    'object.min': 'Vui lòng cung cấp ít nhất một trường để cập nhật',
  }),
};

const deleteLocationSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.hex': 'ID địa điểm không hợp lệ',
      'string.length': 'ID địa điểm không hợp lệ',
      'any.required': 'Vui lòng cung cấp ID địa điểm',
    }),
  }),
};

export { createLocationSchema, updateLocationSchema, deleteLocationSchema };
