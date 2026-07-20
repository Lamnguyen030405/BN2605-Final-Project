import locationService from '../services/locationService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const getAllLocations = async (req, res) => {
  try {
    const locations = await locationService.getAllLocations();
    return sendResponse(res, 200, locations, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const createLocation = async (req, res) => {
  try {
    const { name, city, province, country, latitude, longitude } = req.body;

    const existingLocation = await locationService.checkDuplicateLocation(
      name,
      province,
    );

    if (existingLocation) {
      return sendResponse(res, 409, null, false, [
        'Địa điểm này đã tồn tại trong hệ thống',
      ]);
    }

    const newLocation = await locationService.createLocation({
      name,
      city,
      province,
      country: country || 'Vietnam',
      latitude,
      longitude,
    });

    return sendResponse(res, 201, newLocation, true, [
      'Tạo địa điểm thành công',
    ]);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, province, country, latitude, longitude } = req.body;

    if (name || province) {
      const locationToUpdate = await locationService.getLocationById(id);
      if (!locationToUpdate) {
        return sendResponse(res, 404, null, false, ['Không tìm thấy địa điểm']);
      }

      const checkName = name || locationToUpdate.name;
      const checkProvince = province || locationToUpdate.province;

      const existingLocation = await locationService.checkDuplicateLocation(
        checkName,
        checkProvince,
        id,
      );

      if (existingLocation) {
        return sendResponse(res, 409, null, false, [
          'Tên địa điểm này đã tồn tại trong cùng tỉnh/thành phố',
        ]);
      }
    }

    const updatedLocation = await locationService.updateLocation(id, {
      name,
      city,
      province,
      country,
      latitude,
      longitude,
    });

    if (!updatedLocation) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy địa điểm']);
    }

    return sendResponse(res, 200, updatedLocation, true, [
      'Cập nhật địa điểm thành công',
    ]);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLocation = await locationService.deleteLocation(
      id,
      req.user.id,
    );

    if (!deletedLocation) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy địa điểm']);
    }

    return sendResponse(res, 200, null, true, ['Xóa địa điểm thành công']);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export { getAllLocations, createLocation, updateLocation, deleteLocation };
