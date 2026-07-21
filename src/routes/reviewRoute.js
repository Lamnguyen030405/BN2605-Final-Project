import { Router } from 'express';
import { verifyToken, isOwnerOrAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createReviewSchema,
  replyReviewSchema,
  updateReviewStatusSchema,
} from '../validations/reviewValidation.js';
import reviewController from '../controllers/reviewController.js';

const router = Router();

router.get('/property/:propertyId', reviewController.getPropertyReviews);

router.use(verifyToken);

router.post('/', validate(createReviewSchema), reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

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
