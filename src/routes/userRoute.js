import { Router } from 'express';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadAvatar } from '../middlewares/upload.js';
import {
  updateProfileSchema,
  updatePasswordSchema,
  statusSchema,
  deleteSchema
} from '../validations/userValidation.js';
import {
  getProfile,
  updateProfile,
  updatePassword,
  getAllUsers,
  toggleUserStatus,
  deleteUser
} from '../controllers/userController.js';

const router = Router();

// ==============================
// CÁC API DÀNH CHO NGƯỜI DÙNG (Cần đăng nhập)
// ==============================
router.use(verifyToken);

router.get('/me', getProfile);

// Đã gộp chức năng upload avatar bằng form-data vào chung với cập nhật profile
router.put('/me', uploadAvatar('avatar'), validate(updateProfileSchema), updateProfile);

router.put('/me/password', validate(updatePasswordSchema), updatePassword);

// ==============================
// CÁC API DÀNH CHO ADMIN (Cần đăng nhập và quyền Admin)
// ==============================
router.get('/', isAdmin, getAllUsers);

router.patch('/:id/status', isAdmin, validate(statusSchema), toggleUserStatus);

router.delete('/:id', isAdmin, validate(deleteSchema), deleteUser);

export default router;
