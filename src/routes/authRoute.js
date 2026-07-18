import { Router } from 'express';
import authController from '../controllers/authController.js';
import { sendResponse } from '../helpers/sendResponse.js';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 1000 * 60 * 5,
  max: 5,
  message: 'Too many requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  handler: (req, res, next, options) => {
    return sendResponse(res, 429, null, false, options.message);
  },
});

const router = Router();

router.post('/login', authLimiter, authController.login);

router.post('/register', authController.register);

router.post('/logout', authController.logout);

router.post('/verify-otp', authController.verifyOTP);

router.post('/refresh', authController.refresh);

export default router;
