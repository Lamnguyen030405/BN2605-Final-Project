import { Booking } from '../models/bookingModel.js';
import { Property } from '../models/propertyModel.js';
import { Room } from '../models/roomModel.js';
import { Ticket } from '../models/ticketModel.js';

const checkPropertyOwnership = async (propertyId, userId, userRole) => {
  if (userRole === 'admin') return true;
  const property = await Property.findById(propertyId).lean();
  if (!property) throw new Error('Không tìm thấy cơ sở lưu trú');
  if (property.owner_id.toString() !== userId) {
    throw new Error('Bạn không có quyền thao tác trên cơ sở lưu trú này');
  }
  return true;
};

const createBooking = async (data, userId) => {
  const {
    property_id,
    booking_type,
    rooms,
    tickets,
    check_in,
    payment_method,
  } = data;

  const property = await Property.findById(property_id).lean();
  if (!property) throw new Error('Không tìm thấy cơ sở lưu trú');

  let totalPrice = 0;
  const processedRooms = [];
  const processedTickets = [];

  // Tính toán giá cho Khách sạn
  if (booking_type === 'hotel') {
    if (!rooms || rooms.length === 0)
      throw new Error('Cần chọn ít nhất 1 phòng');

    for (const roomData of rooms) {
      const room = await Room.findOne({
        _id: roomData.room_id,
        property_id,
        isDeleted: false,
      });
      if (!room) throw new Error(`Không tìm thấy phòng ${roomData.room_id}`);
      if (!room.is_available)
        throw new Error(
          `Phòng ${room.room_number || room.room_type} hiện không trống`,
        );

      const priceSnapshot = room.price_per_night;
      const nights = roomData.nights || 1;
      totalPrice += priceSnapshot * nights;

      processedRooms.push({
        room_id: room._id,
        price_snapshot: priceSnapshot,
        nights,
      });

      // Tạm thời đánh dấu phòng là không trống (Logic đơn giản)
      await Room.findByIdAndUpdate(room._id, { is_available: false });
    }
  }

  // Tính toán giá cho Vé tham quan
  if (booking_type === 'attraction') {
    if (!tickets || tickets.length === 0)
      throw new Error('Cần chọn ít nhất 1 vé');

    for (const ticketData of tickets) {
      const ticket = await Ticket.findOne({
        _id: ticketData.ticket_id,
        property_id,
        isDeleted: false,
      });
      if (!ticket) throw new Error(`Không tìm thấy vé ${ticketData.ticket_id}`);
      if (!ticket.isActive) throw new Error(`Vé ${ticket.name} hiện ngừng bán`);

      const visitDate = new Date(ticketData.visit_date);
      // Logic nâng cao: Check quota_per_day
      if (ticket.quota_per_day) {
        // Tìm tổng số vé đã bán trong ngày đó
        const startOfDay = new Date(visitDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(visitDate.setHours(23, 59, 59, 999));

        const existingBookings = await Booking.aggregate([
          {
            $match: {
              property_id: property._id,
              booking_type: 'attraction',
              status: { $nin: ['cancelled', 'refunded'] },
              isDeleted: false,
            },
          },
          { $unwind: '$tickets' },
          {
            $match: {
              'tickets.ticket_id': ticket._id,
              'tickets.visit_date': { $gte: startOfDay, $lte: endOfDay },
            },
          },
          {
            $group: { _id: null, totalQuantity: { $sum: '$tickets.quantity' } },
          },
        ]);

        const soldQuantity =
          existingBookings.length > 0 ? existingBookings[0].totalQuantity : 0;
        if (soldQuantity + ticketData.quantity > ticket.quota_per_day) {
          throw new Error(
            `Vé ${ticket.name} đã hết lượt bán trong ngày ${startOfDay.toLocaleDateString()}`,
          );
        }
      }

      const priceSnapshot = ticket.price;
      const quantity = ticketData.quantity || 1;
      totalPrice += priceSnapshot * quantity;

      processedTickets.push({
        ticket_id: ticket._id,
        visit_date: ticketData.visit_date,
        quantity,
        price_snapshot: priceSnapshot,
      });
    }
  }

  // Tính tiền cuối cùng (Có thể áp dụng mã giảm giá ở đây sau này)
  const discount = data.discount || 0;
  const finalPrice = Math.max(0, totalPrice - discount);

  const booking = new Booking({
    user_id: userId,
    property_id,
    booking_type,
    check_in,
    check_out: data.check_out,
    guests: data.guests,
    special_requests: data.special_requests,
    total_price: totalPrice,
    discount,
    final_price: finalPrice,
    status: 'pending',
    payment: {
      amount: finalPrice,
      method: payment_method,
      status: 'pending',
    },
    rooms: processedRooms,
    tickets: processedTickets,
  });

  await booking.save();
  return booking;
};

const getMyBookings = async (userId) => {
  return await Booking.find({ user_id: userId, isDeleted: false })
    .populate('property_id', 'name images')
    .populate('rooms.room_id', 'room_type room_number images')
    .populate('tickets.ticket_id', 'name')
    .sort({ created_at: -1 })
    .lean();
};

const getOwnerBookings = async (userId) => {
  // Tìm các property của owner
  const properties = await Property.find({ owner_id: userId, isDeleted: false })
    .select('_id')
    .lean();
  const propertyIds = properties.map((p) => p._id);

  return await Booking.find({
    property_id: { $in: propertyIds },
    isDeleted: false,
  })
    .populate('user_id', 'full_name email phone')
    .populate('property_id', 'name')
    .populate('rooms.room_id', 'room_type room_number')
    .populate('tickets.ticket_id', 'name')
    .sort({ created_at: -1 })
    .lean();
};

const getAllBookings = async (query = {}) => {
  return await Booking.find({ isDeleted: false, ...query })
    .populate('user_id', 'full_name email phone')
    .populate('property_id', 'name')
    .sort({ created_at: -1 })
    .lean();
};

const getBookingById = async (id, userId, userRole) => {
  const booking = await Booking.findOne({ _id: id, isDeleted: false })
    .populate('user_id', 'full_name email phone')
    .populate('property_id')
    .populate('rooms.room_id')
    .populate('tickets.ticket_id')
    .lean();

  if (!booking) throw new Error('Không tìm thấy Booking');

  // Phân quyền xem
  if (userRole === 'customer' && booking.user_id._id.toString() !== userId) {
    throw new Error('Bạn không có quyền xem Booking này');
  } else if (userRole === 'owner') {
    if (booking.property_id.owner_id.toString() !== userId) {
      throw new Error('Bạn không có quyền xem Booking này');
    }
  }

  return booking;
};

const cancelBooking = async (id, userId) => {
  const booking = await Booking.findOne({ _id: id, isDeleted: false });
  if (!booking) throw new Error('Không tìm thấy Booking');

  if (booking.user_id.toString() !== userId) {
    throw new Error('Bạn không có quyền hủy Booking này');
  }

  if (['cancelled', 'refunded', 'completed'].includes(booking.status)) {
    throw new Error(`Không thể hủy Booking ở trạng thái ${booking.status}`);
  }

  booking.status = 'cancelled';
  booking.cancelled_at = new Date();
  await booking.save();

  // Nhả phòng trống lại
  if (booking.booking_type === 'hotel') {
    for (const r of booking.rooms) {
      await Room.findByIdAndUpdate(r.room_id, { is_available: true });
    }
  }

  return booking;
};

const updateBookingStatus = async (id, status, userId, userRole) => {
  const booking = await Booking.findOne({ _id: id, isDeleted: false });
  if (!booking) throw new Error('Không tìm thấy Booking');

  await checkPropertyOwnership(booking.property_id, userId, userRole);

  booking.status = status;
  if (status === 'completed' && booking.payment) {
    booking.payment.status = 'paid';
    booking.payment.paid_at = new Date();
  }

  if (['cancelled', 'refunded', 'completed'].includes(status)) {
    if (status === 'cancelled' || status === 'refunded') {
      booking.cancelled_at = new Date();
    }
    // Nhả phòng trống lại
    if (booking.booking_type === 'hotel') {
      for (const r of booking.rooms) {
        await Room.findByIdAndUpdate(r.room_id, { is_available: true });
      }
    }
  }

  await booking.save();
  return booking;
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
