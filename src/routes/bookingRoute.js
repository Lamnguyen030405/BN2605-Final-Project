import { Router } from 'express';
import { verifyToken, isAdmin, isOwnerOrAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from '../validations/bookingValidation.js';
import bookingController from '../controllers/bookingController.js';

const router = Router();

router.use(verifyToken);

router.post(
  '/',
  validate(createBookingSchema),
  bookingController.createBooking,
);
router.get('/my-bookings', bookingController.getMyBookings);
router.patch('/:id/cancel', bookingController.cancelBooking);

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

router.get('/admin-bookings', isAdmin, bookingController.getAllBookings);

router.get('/:id', bookingController.getBookingById);

export default router;
