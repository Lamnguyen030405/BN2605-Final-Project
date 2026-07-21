import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { wishlistSchema } from '../validations/wishlistValidation.js';
import wishlistController from '../controllers/wishlistController.js';

const router = Router();

router.use(verifyToken);

router.get('/', wishlistController.getMyWishlist);
router.post('/', validate(wishlistSchema), wishlistController.addToWishlist);
router.delete('/:propertyId', wishlistController.removeFromWishlist);

export default router;
