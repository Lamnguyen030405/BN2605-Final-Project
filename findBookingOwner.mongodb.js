// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('travel_booking');

// ĐIỀN ID CỦA BOOKING VÀO ĐÂY
const targetBookingId = ObjectId('6a5f3725d019a11def831cf1');

db.getCollection('bookings').aggregate([
  // 1. Tìm booking cụ thể
  { $match: { _id: targetBookingId } },

  // 2. Lookup (Join) sang bảng properties để lấy thông tin cơ sở lưu trú
  {
    $lookup: {
      from: 'properties', // Tên collection trong MongoDB thường là số nhiều chữ thường
      localField: 'property_id',
      foreignField: '_id',
      as: 'property_details',
    },
  },

  // 3. Giải nén mảng property_details
  { $unwind: '$property_details' },

  // 4. Lookup (Join) từ property sang bảng users để lấy thông tin owner
  {
    $lookup: {
      from: 'users',
      localField: 'property_details.owner_id',
      foreignField: '_id',
      as: 'owner_details',
    },
  },

  // 5. Giải nén mảng owner_details
  { $unwind: '$owner_details' },

  // 6. Lọc ra những trường dữ liệu cần thiết để dễ nhìn
  {
    $project: {
      _id: 0,
      booking_id: '$_id',
      customer_id: '$user_id',
      booking_status: '$status',
      property_name: '$property_details.name',
      owner_id: '$owner_details._id',
      owner_name: '$owner_details.full_name',
      owner_email: '$owner_details.email',
      owner_phone: '$owner_details.phone',
    },
  },
]);
