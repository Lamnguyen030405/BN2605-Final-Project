import bookingService from '../services/bookingService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user.id);
    return sendResponse(res, 201, booking, true, ['Tạo Booking thành công']);
  } catch (error) {
    if (
      error.message.includes('không trống') ||
      error.message.includes('hết lượt')
    ) {
      return sendResponse(res, 400, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getMyBookings(req.user.id);
    return sendResponse(res, 200, bookings, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getOwnerBookings(req.user.id);
    return sendResponse(res, 200, bookings, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings(req.query);
    return sendResponse(res, 200, bookings, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const getBookingById = async (req, res) => {
  try {
    const userRole = req.user.role?.name || 'customer';
    const booking = await bookingService.getBookingById(
      req.params.id,
      req.user.id,
      userRole,
    );
    return sendResponse(res, 200, booking, true);
  } catch (error) {
    if (
      error.message.includes('quyền') ||
      error.message.includes('Không tìm thấy')
    ) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user.id,
    );
    return sendResponse(res, 200, booking, true, ['Hủy Booking thành công']);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 400, null, false, [error.message]);
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const userRole = req.user.role?.name || 'customer';
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      status,
      req.user.id,
      userRole,
    );
    return sendResponse(res, 200, booking, true, [
      'Cập nhật trạng thái thành công',
    ]);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 400, null, false, [error.message]);
  }
};

export default {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
};
