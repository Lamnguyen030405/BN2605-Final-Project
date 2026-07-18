import { Router } from 'express';
import { createRole } from '../controllers/roleController.js';

const router = Router();

router.post('/', createRole);

export default router;
