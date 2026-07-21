import Joi from 'joi';

export const createPropertySchema = {
  body: Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Tên cơ sở lưu trú không được để trống',
      'any.required': 'Trường name là bắt buộc',
    }),
    location_id: Joi.string().required().messages({
      'string.empty': 'ID địa điểm không được để trống',
      'any.required': 'Trường location_id là bắt buộc',
    }),
    type: Joi.string()
      .valid(
        'hotel',
        'resort',
        'villa',
        'hostel',
        'attraction',
        'theme_park',
        'museum',
        'other',
      )
      .default('hotel')
      .messages({
        'any.only': 'Loại cơ sở lưu trú không hợp lệ',
      }),
    description: Joi.string().allow('', null),
    address: Joi.string().required().messages({
      'string.empty': 'Địa chỉ không được để trống',
      'any.required': 'Trường address là bắt buộc',
    }),
    base_price: Joi.number().min(0).required().messages({
      'number.base': 'Giá cơ bản phải là một số',
      'number.min': 'Giá cơ bản không được nhỏ hơn 0',
      'any.required': 'Trường base_price là bắt buộc',
    }),
    amenities: Joi.alternatives()
      .try(
        Joi.array().items(Joi.string()),
        Joi.string(), // Cho phép gửi dạng string phân tách bằng dấu phẩy nếu form-data không gửi mảng chuẩn
      )
      .optional(),
    owner_id: Joi.string().optional(), // Nếu admin tạo thì có thể truyền vào, còn owner thì tự lấy từ token
  }),
};

export const updatePropertySchema = {
  body: Joi.object({
    name: Joi.string().optional(),
    location_id: Joi.string().optional(),
    type: Joi.string()
      .valid(
        'hotel',
        'resort',
        'villa',
        'hostel',
        'attraction',
        'theme_park',
        'museum',
        'other',
      )
      .optional(),
    description: Joi.string().allow('', null).optional(),
    address: Joi.string().optional(),
    base_price: Joi.number().min(0).optional(),
    amenities: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional(),
    isActive: Joi.boolean().optional(),

    retained_images: Joi.alternatives()
      .try(Joi.array().items(Joi.string()), Joi.string())
      .optional(),
  }),
};

export const propertyQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    location_id: Joi.string().optional(),
    type: Joi.string().optional(),
    min_price: Joi.number().min(0).optional(),
    max_price: Joi.number().min(0).optional(),
    search: Joi.string().allow('', null).optional(),
    sort_by: Joi.string()
      .valid('price_asc', 'price_desc', 'rating_desc', 'newest')
      .default('newest'),
    amenities: Joi.string().optional(), // VD: "id1,id2"
  }),
};
