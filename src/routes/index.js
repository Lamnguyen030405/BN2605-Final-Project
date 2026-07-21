import { Router } from 'express';
import authRoute from './authRoute.js';
import roleRoute from './roleRoute.js';
import userRoute from './userRoute.js';
import locationRoute from './locationRoute.js';
import propertyRoute from './propertyRoute.js';
import roomRoute from './roomRoute.js';
import ticketRoute from './ticketRoute.js';
import bookingRoute from './bookingRoute.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/roles', roleRoute);
router.use('/users', userRoute);
router.use('/locations', locationRoute);
router.use('/properties', propertyRoute);
router.use('/rooms', roomRoute);
router.use('/tickets', ticketRoute);
router.use('/bookings', bookingRoute);

export default router;
