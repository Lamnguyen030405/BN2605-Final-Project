import { Router } from 'express';
import { verifyToken, isOwnerOrAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadRoomImage } from '../middlewares/upload.js';
import {
  createRoomSchema,
  updateRoomSchema,
} from '../validations/roomValidation.js';
import roomController from '../controllers/roomController.js';

const router = Router();

router.get('/property/:propertyId', roomController.getRoomsByPropertyId);
router.get('/:id', roomController.getRoomById);

router.use(verifyToken, isOwnerOrAdmin);

router.post(
  '/',
  uploadRoomImage.array('images', 5),
  validate(createRoomSchema),
  roomController.createRoom,
);

router.put(
  '/:id',
  uploadRoomImage.array('images', 5),
  validate(updateRoomSchema),
  roomController.updateRoom,
);

router.delete('/:id', roomController.deleteRoom);

export default router;
