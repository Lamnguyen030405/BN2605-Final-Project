import { Router } from 'express';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadAvatar } from '../middlewares/upload.js';
import {
  updateProfileSchema,
  updatePasswordSchema,
  statusSchema,
  deleteSchema,
} from '../validations/userValidation.js';
import userController from '../controllers/userController.js';

const router = Router();

router.use(verifyToken);

router.get('/me', userController.getProfile);

router.put(
  '/me',
  uploadAvatar.single('avatar'),
  validate(updateProfileSchema),
  userController.updateProfile,
);

router.put(
  '/me/password',
  validate(updatePasswordSchema),
  userController.updatePassword,
);

router.get('/', isAdmin, userController.getAllUsers);

router.patch(
  '/:id/status',
  isAdmin,
  validate(statusSchema),
  userController.toggleUserStatus,
);

router.delete(
  '/:id',
  isAdmin,
  validate(deleteSchema),
  userController.deleteUser,
);

export default router;
