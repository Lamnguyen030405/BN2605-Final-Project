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

// ==============================
// CÁC API DÀNH CHO NGƯỜI DÙNG (Cần đăng nhập)
// ==============================
router.use(verifyToken);

router.get('/me', userController.getProfile);

// Đã gộp chức năng upload avatar bằng form-data vào chung với cập nhật profile
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

// ==============================
// CÁC API DÀNH CHO ADMIN (Cần đăng nhập và quyền Admin)
// ==============================
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
