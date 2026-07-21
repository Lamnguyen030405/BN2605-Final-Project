import { Router } from 'express';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createAmenitySchema } from '../validations/amenityValidation.js';
import amenityController from '../controllers/amenityController.js';

const router = Router();

// Public API
router.get('/', amenityController.getAllAmenities);

// Admin API
router.post(
  '/',
  verifyToken,
  isAdmin,
  validate(createAmenitySchema),
  amenityController.createAmenity,
);

export default router;
