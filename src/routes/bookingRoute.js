import { Router } from 'express';
import { verifyToken, isAdmin, isOwnerOrAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from '../validations/bookingValidation.js';
import bookingController from '../controllers/bookingController.js';

const router = Router();

// Tất cả APIs đặt chỗ đều yêu cầu đăng nhập
router.use(verifyToken);

// ==============================
// PUBLIC FOR LOGGED IN USERS
// ==============================
router.post(
  '/',
  validate(createBookingSchema),
  bookingController.createBooking,
);
router.get('/my-bookings', bookingController.getMyBookings);
router.patch('/:id/cancel', bookingController.cancelBooking);

// ==============================
// PROTECTED APIS (Admin or Owner)
// ==============================
router.get(
  '/owner-bookings',
  isOwnerOrAdmin,
  bookingController.getOwnerBookings,
);
router.patch(
  '/:id/status',
  isOwnerOrAdmin,
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus,
);

// ==============================
// ADMIN ONLY APIS
// ==============================
router.get('/admin-bookings', isAdmin, bookingController.getAllBookings);

// API dùng chung cho mọi user đã login, nhưng phân quyền xem bên trong service
router.get('/:id', bookingController.getBookingById);

export default router;
