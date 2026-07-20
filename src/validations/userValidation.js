import Joi from 'joi';

const updateProfileSchema = {
  body: Joi.object({
    full_name: Joi.string().min(2).max(100).messages({
      'string.min': 'Họ tên phải có ít nhất {#limit} ký tự',
      'string.max': 'Họ tên không được vượt quá {#limit} ký tự',
      'string.empty': 'Họ tên không được để trống',
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,11}$/)
      .messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ, phải từ 10-11 số',
        'string.empty': 'Số điện thoại không được để trống',
      }),
    gender: Joi.string().valid('male', 'female', 'other').messages({
      'any.only': 'Giới tính chỉ được chọn male, female hoặc other',
    }),
    dateOfBirth: Joi.date().iso().less('now').messages({
      'date.format': 'Ngày sinh phải đúng định dạng chuẩn ISO (YYYY-MM-DD)',
      'date.less': 'Ngày sinh không được lớn hơn ngày hiện tại',
    }),
    avatar: Joi.string().uri().allow('').messages({
      'string.uri': 'Avatar phải là một đường dẫn URL hợp lệ',
    }),
  }),
};

const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required().messages({
      'any.required': 'Vui lòng nhập mật khẩu cũ',
      'string.empty': 'Mật khẩu cũ không được để trống',
    }),
    newPassword: Joi.string().min(8).required().messages({
      'string.min': 'Mật khẩu mới phải có ít nhất {#limit} ký tự',
      'any.required': 'Vui lòng nhập mật khẩu mới',
      'string.empty': 'Mật khẩu mới không được để trống',
    }),
  }),
};

export { updateProfileSchema, updatePasswordSchema };
