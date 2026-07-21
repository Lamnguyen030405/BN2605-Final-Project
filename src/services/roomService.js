import { Room } from '../models/roomModel.js';
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

const getRoomsByPropertyId = async (propertyId) => {
  return await Room.find({ property_id: propertyId, isDeleted: false })
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();
};

const getRoomById = async (id) => {
  return await Room.findOne({ _id: id, isDeleted: false })
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();
};

const createRoom = async (data, userId, userRole) => {
  await checkPropertyOwnership(data.property_id, userId, userRole);

  const newRoom = new Room(data);
  await newRoom.save();

  const result = newRoom.toObject();
  delete result.isDeleted;
  delete result.deletedAt;
  delete result.deletedBy;

  return result;
};

const updateRoom = async (id, data, userId, userRole) => {
  const room = await Room.findOne({ _id: id, isDeleted: false }).lean();
  if (!room) return null;

  await checkPropertyOwnership(room.property_id, userId, userRole);

  const updatedRoom = await Room.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { new: true, runValidators: true },
  )
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();

  return updatedRoom;
};

const deleteRoom = async (id, userId, userRole) => {
  const room = await Room.findOne({ _id: id, isDeleted: false }).lean();
  if (!room) return null;

  await checkPropertyOwnership(room.property_id, userId, userRole);

  const deletedRoom = await Room.findOneAndUpdate(
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

  return deletedRoom;
};

export default {
  getRoomsByPropertyId,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
