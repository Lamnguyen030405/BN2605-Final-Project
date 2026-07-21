import { Router } from 'express';
import { verifyToken, isOwnerOrAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createTicketSchema,
  updateTicketSchema,
} from '../validations/ticketValidation.js';
import ticketController from '../controllers/ticketController.js';

const router = Router();

// ==============================
// PUBLIC APIS
// ==============================
router.get('/property/:propertyId', ticketController.getTicketsByPropertyId);
router.get('/:id', ticketController.getTicketById);

// ==============================
// PROTECTED APIS (Admin or Owner)
// ==============================
router.use(verifyToken, isOwnerOrAdmin);

router.post('/', validate(createTicketSchema), ticketController.createTicket);

router.put('/:id', validate(updateTicketSchema), ticketController.updateTicket);

router.delete('/:id', ticketController.deleteTicket);

export default router;
