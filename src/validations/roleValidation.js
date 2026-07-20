import Joi from 'joi';

const createRoleSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Tên chức vụ phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên chức vụ không được vượt quá {#limit} ký tự',
      'any.required': 'Vui lòng cung cấp tên chức vụ',
      'string.empty': 'Tên chức vụ không được để trống',
    }),
    description: Joi.string().max(255).allow('').messages({
      'string.max': 'Mô tả không được vượt quá {#limit} ký tự',
    }),
  }),
};

const updateRoleSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.hex': 'ID chức vụ không hợp lệ',
      'string.length': 'ID chức vụ không hợp lệ',
      'any.required': 'Vui lòng cung cấp ID chức vụ',
    }),
  }),
  body: Joi.object({
    name: Joi.string().min(2).max(50).messages({
      'string.min': 'Tên chức vụ phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên chức vụ không được vượt quá {#limit} ký tự',
      'string.empty': 'Tên chức vụ không được để trống',
    }),
    description: Joi.string().max(255).allow('').messages({
      'string.max': 'Mô tả không được vượt quá {#limit} ký tự',
    }),
  }),
};

const deleteRoleSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.hex': 'ID chức vụ không hợp lệ',
      'string.length': 'ID chức vụ không hợp lệ',
      'any.required': 'Vui lòng cung cấp ID chức vụ',
    }),
  }),
};

export { createRoleSchema, updateRoleSchema, deleteRoleSchema };
