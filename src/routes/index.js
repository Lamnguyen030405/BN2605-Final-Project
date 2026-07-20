import { Router } from 'express';
import authRoute from './authRoute.js';
import roleRoute from './roleRoute.js';
import userRoute from './userRoute.js';
import locationRoute from './locationRoute.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/roles', roleRoute);
router.use('/users', userRoute);
router.use('/locations', locationRoute);

export default router;
