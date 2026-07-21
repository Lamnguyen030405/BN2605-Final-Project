import { Router } from 'express';
import { verifyToken, isOwnerOrAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadPropertyImage } from '../middlewares/upload.js';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
} from '../validations/propertyValidation.js';
import propertyController from '../controllers/propertyController.js';

const router = Router();

// ==============================
// PUBLIC APIS
// ==============================
// Tìm kiếm, lọc và phân trang Property
router.get(
  '/',
  validate(propertyQuerySchema, 'query'),
  propertyController.getProperties,
);

// Xem chi tiết một Property
router.get('/:id', propertyController.getPropertyById);

// ==============================
// PROTECTED APIS (Admin or Owner)
// ==============================
router.use(verifyToken, isOwnerOrAdmin);

// Tạo mới Property (Cho phép upload tối đa 10 ảnh)
router.post(
  '/',
  uploadPropertyImage.array('images', 10),
  validate(createPropertySchema),
  propertyController.createProperty,
);

// Cập nhật Property (Kèm upload ảnh)
router.put(
  '/:id',
  uploadPropertyImage.array('images', 10),
  validate(updatePropertySchema),
  propertyController.updateProperty,
);

// Xóa mềm Property
router.delete('/:id', propertyController.deleteProperty);

export default router;
