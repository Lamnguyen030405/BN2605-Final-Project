import roomService from '../services/roomService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const getRoomsByPropertyId = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const rooms = await roomService.getRoomsByPropertyId(propertyId);
    return sendResponse(res, 200, rooms, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);

    if (!room) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy phòng']);
    }

    return sendResponse(res, 200, room, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const createRoom = async (req, res) => {
  try {
    const roomData = { ...req.body };
    const userRole =
      req.user.role?.role_name || (req.user.role_id === 1 ? 'admin' : 'owner');

    if (req.files && req.files.length > 0) {
      roomData.images = req.files.map((file, index) => ({
        url: file.path,
        is_primary: index === 0, // Ảnh đầu tiên mặc định làm ảnh chính
        sort_order: index,
      }));
    } else {
      roomData.images = [];
    }

    const newRoom = await roomService.createRoom(
      roomData,
      req.user.id,
      userRole,
    );

    return sendResponse(res, 201, newRoom, true, ['Tạo phòng thành công']);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const roomData = { ...req.body };
    const userRole =
      req.user.role?.role_name || (req.user.role_id === 1 ? 'admin' : 'owner');

    let finalImages = [];

    if (roomData.retained_images) {
      try {
        finalImages = Array.isArray(roomData.retained_images)
          ? roomData.retained_images
          : JSON.parse(roomData.retained_images);
      } catch (e) {
        console.error('Lỗi parse retained_images', e);
      }
      delete roomData.retained_images;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: file.path,
        is_primary: finalImages.length === 0 && index === 0,
        sort_order: finalImages.length + index,
      }));
      finalImages = [...finalImages, ...newImages];
    }

    if (finalImages.length > 0) {
      roomData.images = finalImages;
    }

    const updatedRoom = await roomService.updateRoom(
      id,
      roomData,
      req.user.id,
      userRole,
    );

    if (!updatedRoom) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy phòng']);
    }

    return sendResponse(res, 200, updatedRoom, true, [
      'Cập nhật phòng thành công',
    ]);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole =
      req.user.role?.role_name || (req.user.role_id === 1 ? 'admin' : 'owner');

    const deletedRoom = await roomService.deleteRoom(id, req.user.id, userRole);

    if (!deletedRoom) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy phòng']);
    }

    return sendResponse(res, 200, null, true, ['Xóa phòng thành công']);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export default {
  getRoomsByPropertyId,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
