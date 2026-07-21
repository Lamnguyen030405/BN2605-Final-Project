import Joi from 'joi';

export const createRoomSchema = {
  body: Joi.object({
    property_id: Joi.string().required().messages({
      'string.empty': 'ID Khách sạn/Resort không được để trống',
      'any.required': 'Trường property_id là bắt buộc',
    }),
    room_number: Joi.string().allow('', null),
    room_type: Joi.string().required().messages({
      'string.empty': 'Loại phòng không được để trống',
      'any.required': 'Trường room_type là bắt buộc',
    }),
    description: Joi.string().allow('', null),
    price_per_night: Joi.number().min(0).required().messages({
      'number.base': 'Giá phòng phải là một số',
      'number.min': 'Giá phòng không được nhỏ hơn 0',
      'any.required': 'Trường price_per_night là bắt buộc',
    }),
    max_guests: Joi.number().integer().min(1).default(2),
    bed_type: Joi.string().allow('', null),
    floor: Joi.number().integer().allow(null),
    is_available: Joi.boolean().default(true),
  }),
};

export const updateRoomSchema = {
  body: Joi.object({
    room_number: Joi.string().allow('', null),
    room_type: Joi.string().optional(),
    description: Joi.string().allow('', null).optional(),
    price_per_night: Joi.number().min(0).optional(),
    max_guests: Joi.number().integer().min(1).optional(),
    bed_type: Joi.string().allow('', null).optional(),
    floor: Joi.number().integer().allow(null).optional(),
    is_available: Joi.boolean().optional(),
    retained_images: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional(),
  }),
};
