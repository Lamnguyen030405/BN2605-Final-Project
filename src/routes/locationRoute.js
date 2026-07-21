import { Router } from 'express';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createLocationSchema,
  updateLocationSchema,
  deleteLocationSchema,
} from '../validations/locationValidation.js';
import locationController from '../controllers/locationController.js';

const router = Router();

router.get('/', locationController.getAllLocations);

router.use(verifyToken, isAdmin);

router.post(
  '/',
  validate(createLocationSchema),
  locationController.createLocation,
);
router.put(
  '/:id',
  validate(updateLocationSchema),
  locationController.updateLocation,
);
router.delete(
  '/:id',
  validate(deleteLocationSchema),
  locationController.deleteLocation,
);

export default router;
