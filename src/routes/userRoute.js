import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadAvatar } from '../middlewares/upload.js';
import {
  updateProfileSchema,
  updatePasswordSchema,
} from '../validations/userValidation.js';
import {
  getProfile,
  updateProfile,
  updatePassword,
} from '../controllers/userController.js';

const router = Router();

router.use(verifyToken);

router.get('/me', getProfile);

router.put(
  '/me',
  uploadAvatar('avatar'),
  validate(updateProfileSchema),
  updateProfile
);

router.put('/me/password', validate(updatePasswordSchema), updatePassword);

export default router;
