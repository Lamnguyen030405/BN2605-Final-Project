import { Router } from 'express';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createLocationSchema,
  updateLocationSchema,
  deleteLocationSchema,
} from '../validations/locationValidation.js';
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationController.js';

const router = Router();

// GET /api/locations: Public access (không cần verifyToken)
router.get('/', getAllLocations);

// Các thao tác POST, PUT, DELETE cần quyền Admin
router.use(verifyToken, isAdmin);

router.post('/', validate(createLocationSchema), createLocation);
router.put('/:id', validate(updateLocationSchema), updateLocation);
router.delete('/:id', validate(deleteLocationSchema), deleteLocation);

export default router;
