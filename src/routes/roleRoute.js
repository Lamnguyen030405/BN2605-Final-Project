import { Router } from 'express';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
} from '../validations/roleValidation.js';
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';

const router = Router();

// Phân quyền: Tất cả API của Role đều chỉ dành cho Admin
router.use(verifyToken, isAdmin);

router.get('/', getAllRoles);
router.post('/', validate(createRoleSchema), createRole);
router.put('/:id', validate(updateRoleSchema), updateRole);
router.delete('/:id', validate(deleteRoleSchema), deleteRole);

export default router;
