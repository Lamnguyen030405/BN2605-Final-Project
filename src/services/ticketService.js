import { Ticket } from '../models/ticketModel.js';
import { Property } from '../models/propertyModel.js';

const checkPropertyOwnership = async (propertyId, userId, userRole) => {
  if (userRole === 'admin') return true;

  const property = await Property.findById(propertyId).lean();
  if (!property) {
    throw new Error('Không tìm thấy cơ sở lưu trú');
  }

  if (property.owner_id.toString() !== userId) {
    throw new Error('Bạn không có quyền thao tác trên cơ sở lưu trú này');
  }

  return true;
};

const getTicketsByPropertyId = async (propertyId) => {
  return await Ticket.find({ property_id: propertyId, isDeleted: false })
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();
};

const getTicketById = async (id) => {
  return await Ticket.findOne({ _id: id, isDeleted: false })
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();
};

const createTicket = async (data, userId, userRole) => {
  await checkPropertyOwnership(data.property_id, userId, userRole);

  const newTicket = new Ticket(data);
  await newTicket.save();

  const result = newTicket.toObject();
  delete result.isDeleted;
  delete result.deletedAt;
  delete result.deletedBy;

  return result;
};

const updateTicket = async (id, data, userId, userRole) => {
  const ticket = await Ticket.findOne({ _id: id, isDeleted: false }).lean();
  if (!ticket) return null;

  await checkPropertyOwnership(ticket.property_id, userId, userRole);

  const updatedTicket = await Ticket.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { new: true, runValidators: true },
  )
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();

  return updatedTicket;
};

const deleteTicket = async (id, userId, userRole) => {
  const ticket = await Ticket.findOne({ _id: id, isDeleted: false }).lean();
  if (!ticket) return null;

  await checkPropertyOwnership(ticket.property_id, userId, userRole);

  const deletedTicket = await Ticket.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    },
    { new: true },
  ).lean();

  return deletedTicket;
};

export default {
  getTicketsByPropertyId,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
