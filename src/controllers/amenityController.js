import amenityService from '../services/amenityService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const getAllAmenities = async (req, res) => {
  try {
    const amenities = await amenityService.getAllAmenities();
    return sendResponse(res, 200, amenities, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const createAmenity = async (req, res) => {
  try {
    const amenity = await amenityService.createAmenity(req.body);
    return sendResponse(res, 201, amenity, true, ['Tạo tiện ích thành công']);
  } catch (error) {
    if (error.message.includes('đã tồn tại')) {
      return sendResponse(res, 400, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export default { getAllAmenities, createAmenity };
