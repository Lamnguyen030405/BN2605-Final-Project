import ticketService from '../services/ticketService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const getTicketsByPropertyId = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const tickets = await ticketService.getTicketsByPropertyId(propertyId);
    return sendResponse(res, 200, tickets, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy vé']);
    }

    return sendResponse(res, 200, ticket, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const createTicket = async (req, res) => {
  try {
    const ticketData = { ...req.body };
    const userRole =
      req.user.role?.role_name || (req.user.role_id === 1 ? 'admin' : 'owner');

    const newTicket = await ticketService.createTicket(
      ticketData,
      req.user.id,
      userRole,
    );

    return sendResponse(res, 201, newTicket, true, ['Tạo vé thành công']);
  } catch (error) {
    if (
      error.message.includes('quyền') ||
      error.message.includes('Không tìm thấy cơ sở lưu trú')
    ) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticketData = { ...req.body };
    const userRole =
      req.user.role?.role_name || (req.user.role_id === 1 ? 'admin' : 'owner');

    const updatedTicket = await ticketService.updateTicket(
      id,
      ticketData,
      req.user.id,
      userRole,
    );

    if (!updatedTicket) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy vé']);
    }

    return sendResponse(res, 200, updatedTicket, true, [
      'Cập nhật vé thành công',
    ]);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole =
      req.user.role?.role_name || (req.user.role_id === 1 ? 'admin' : 'owner');

    const deletedTicket = await ticketService.deleteTicket(
      id,
      req.user.id,
      userRole,
    );

    if (!deletedTicket) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy vé']);
    }

    return sendResponse(res, 200, null, true, ['Xóa vé thành công']);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export default {
  getTicketsByPropertyId,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
