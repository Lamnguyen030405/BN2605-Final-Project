import Joi from 'joi';

const bookingRoomSchema = Joi.object({
  room_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'room_id phải là định dạng ObjectId hợp lệ',
      'any.required': 'room_id là bắt buộc',
    }),
  nights: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Số đêm phải lớn hơn hoặc bằng 1',
  }),
});

const bookingTicketSchema = Joi.object({
  ticket_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ticket_id phải là định dạng ObjectId hợp lệ',
      'any.required': 'ticket_id là bắt buộc',
    }),
  visit_date: Joi.date().iso().required().messages({
    'any.required': 'visit_date là bắt buộc',
    'date.format': 'visit_date phải đúng định dạng ISO (YYYY-MM-DD)',
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Số lượng vé phải lớn hơn hoặc bằng 1',
  }),
});

export const createBookingSchema = Joi.object({
  property_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'property_id phải là định dạng ObjectId hợp lệ',
      'any.required': 'property_id là bắt buộc',
    }),
  booking_type: Joi.string().valid('hotel', 'attraction').required().messages({
    'any.only': 'booking_type chỉ được phép là hotel hoặc attraction',
    'any.required': 'booking_type là bắt buộc',
  }),
  check_in: Joi.date().iso().required().messages({
    'any.required': 'Ngày check-in là bắt buộc',
    'date.format': 'Ngày check-in phải đúng định dạng ISO',
  }),
  check_out: Joi.date().iso().min(Joi.ref('check_in')).messages({
    'date.min': 'Ngày check-out không được trước ngày check-in',
  }),
  guests: Joi.number().integer().min(1).default(1),
  special_requests: Joi.string().allow('', null),

  // Thanh toán
  payment_method: Joi.string()
    .valid(
      'credit_card',
      'debit_card',
      'bank_transfer',
      'e_wallet',
      'cash',
      'voucher',
    )
    .required()
    .messages({
      'any.required': 'payment_method là bắt buộc',
    }),

  rooms: Joi.alternatives().conditional('booking_type', {
    is: 'hotel',
    then: Joi.array().items(bookingRoomSchema).min(1).required().messages({
      'array.min': 'Phải chọn ít nhất 1 phòng',
      'any.required': 'Danh sách phòng là bắt buộc đối với loại hotel',
    }),
    otherwise: Joi.forbidden(),
  }),

  tickets: Joi.alternatives().conditional('booking_type', {
    is: 'attraction',
    then: Joi.array().items(bookingTicketSchema).min(1).required().messages({
      'array.min': 'Phải chọn ít nhất 1 vé',
      'any.required': 'Danh sách vé là bắt buộc đối với loại attraction',
    }),
    otherwise: Joi.forbidden(),
  }),
});

export const updateBookingStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      'pending',
      'confirmed',
      'checked_in',
      'completed',
      'cancelled',
      'refunded',
    )
    .required()
    .messages({
      'any.required': 'Trạng thái là bắt buộc',
      'any.only': 'Trạng thái không hợp lệ',
    }),
});
