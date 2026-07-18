import { Router } from 'express';
import authRoute from './authRoute.js';
import roleRoute from './roleRoute.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/roles', roleRoute);

export default router;
