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

router.get(
  '/',
  validate(propertyQuerySchema, 'query'),
  propertyController.getProperties,
);

router.get('/:id', propertyController.getPropertyById);

router.use(verifyToken, isOwnerOrAdmin);

router.post(
  '/',
  uploadPropertyImage.array('images', 10),
  validate(createPropertySchema),
  propertyController.createProperty,
);

router.put(
  '/:id',
  uploadPropertyImage.array('images', 10),
  validate(updatePropertySchema),
  propertyController.updateProperty,
);

router.delete('/:id', propertyController.deleteProperty);

export default router;
