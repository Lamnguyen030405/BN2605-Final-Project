import propertyService from '../services/propertyService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const getProperties = async (req, res) => {
  try {
    const result = await propertyService.getAllProperties(req.query);
    return sendResponse(res, 200, result, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await propertyService.getPropertyById(id);

    if (!property) {
      return sendResponse(res, 404, null, false, [
        'Không tìm thấy cơ sở lưu trú',
      ]);
    }

    return sendResponse(res, 200, property, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const createProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body };

    if (!propertyData.owner_id) {
      propertyData.owner_id = req.user.id;
    }

    if (typeof propertyData.amenities === 'string') {
      propertyData.amenities = propertyData.amenities
        .split(',')
        .map((id) => id.trim());
    }

    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map((file, index) => ({
        url: file.path,
        is_primary: index === 0, // Ảnh đầu tiên mặc định làm ảnh chính
        sort_order: index,
      }));
    } else {
      propertyData.images = [];
    }

    const newProperty = await propertyService.createProperty(propertyData);

    return sendResponse(res, 201, newProperty, true, [
      'Tạo cơ sở lưu trú thành công',
    ]);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyData = { ...req.body };

    if (typeof propertyData.amenities === 'string') {
      propertyData.amenities = propertyData.amenities
        .split(',')
        .map((item) => item.trim());
    }

    const userRole =
      req.user.role?.role_name || (req.user.role_id === 1 ? 'admin' : 'owner');

    let finalImages = [];

    if (propertyData.retained_images) {
      try {
        finalImages = Array.isArray(propertyData.retained_images)
          ? propertyData.retained_images
          : JSON.parse(propertyData.retained_images);
      } catch (e) {
        console.error('Lỗi parse retained_images', e);
      }
      delete propertyData.retained_images;
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
      propertyData.images = finalImages;
    }

    const updatedProperty = await propertyService.updateProperty(
      id,
      propertyData,
      req.user.id,
      userRole,
    );

    if (!updatedProperty) {
      return sendResponse(res, 404, null, false, [
        'Không tìm thấy cơ sở lưu trú',
      ]);
    }

    return sendResponse(res, 200, updatedProperty, true, [
      'Cập nhật thành công',
    ]);
  } catch (error) {
    if (error.message.includes('không có quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole =
      req.user.role?.role_name || (req.user.role_id === 1 ? 'admin' : 'owner');

    const deletedProperty = await propertyService.deleteProperty(
      id,
      req.user.id,
      userRole,
    );

    if (!deletedProperty) {
      return sendResponse(res, 404, null, false, [
        'Không tìm thấy cơ sở lưu trú',
      ]);
    }

    return sendResponse(res, 200, null, true, ['Xóa thành công']);
  } catch (error) {
    if (error.message.includes('không có quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export default {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
