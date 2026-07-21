import { Router } from 'express';
import { verifyToken, isAdmin, isOwnerOrAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createReviewSchema,
  replyReviewSchema,
  updateReviewStatusSchema,
} from '../validations/reviewValidation.js';
import reviewController from '../controllers/reviewController.js';

const router = Router();

// ==============================
// PUBLIC APIS
// ==============================
// Lấy danh sách review của 1 property cụ thể
// Lưu ý: Endpoint này bắt đầu bằng /properties/:propertyId/reviews
// nhưng vì được mount ở /reviews nên tôi sẽ đặt path ở đây là /property/:propertyId
router.get('/property/:propertyId', reviewController.getPropertyReviews);

// ==============================
// PROTECTED APIS FOR USERS
// ==============================
router.use(verifyToken);

router.post('/', validate(createReviewSchema), reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

// ==============================
// PROTECTED APIS FOR OWNER/ADMIN
// ==============================
router.post(
  '/:id/reply',
  isOwnerOrAdmin,
  validate(replyReviewSchema),
  reviewController.replyToReview,
);

router.patch(
  '/:id/status',
  isOwnerOrAdmin,
  validate(updateReviewStatusSchema),
  reviewController.updateReviewStatus,
);

export default router;
