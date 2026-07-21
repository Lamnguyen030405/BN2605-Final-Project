import Joi from 'joi';

export const createTicketSchema = {
  body: Joi.object({
    property_id: Joi.string().required().messages({
      'string.empty': 'ID Điểm tham quan không được để trống',
      'any.required': 'Trường property_id là bắt buộc',
    }),
    name: Joi.string().required().messages({
      'string.empty': 'Tên vé không được để trống',
      'any.required': 'Trường name là bắt buộc',
    }),
    description: Joi.string().allow('', null),
    price: Joi.number().min(0).required().messages({
      'number.base': 'Giá vé phải là một số',
      'number.min': 'Giá vé không được nhỏ hơn 0',
      'any.required': 'Trường price là bắt buộc',
    }),
    quota_per_day: Joi.number().integer().min(0).allow(null),
    valid_days: Joi.number().integer().min(1).default(1),
    isActive: Joi.boolean().default(true),
  }),
};

export const updateTicketSchema = {
  body: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().allow('', null).optional(),
    price: Joi.number().min(0).optional(),
    quota_per_day: Joi.number().integer().min(0).allow(null).optional(),
    valid_days: Joi.number().integer().min(1).optional(),
    isActive: Joi.boolean().optional(),
  }),
};
