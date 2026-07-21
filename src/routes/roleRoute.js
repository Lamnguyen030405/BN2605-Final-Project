import { Router } from 'express';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
} from '../validations/roleValidation.js';
import roleController from '../controllers/roleController.js';

const router = Router();

// Phân quyền: Tất cả API của Role đều chỉ dành cho Admin
router.use(verifyToken, isAdmin);

router.get('/', roleController.getAllRoles);
router.post('/', validate(createRoleSchema), roleController.createRole);
router.put('/:id', validate(updateRoleSchema), roleController.updateRole);
router.delete('/:id', validate(deleteRoleSchema), roleController.deleteRole);

export default router;
