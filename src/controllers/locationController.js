import { Location } from '../models/locationModel.js';
import { sendResponse } from '../helpers/sendResponse.js';

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isDeleted: false })
      .select('-deletedAt -deletedBy -isDeleted')
      .lean();

    return sendResponse(res, 200, locations, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const createLocation = async (req, res) => {
  try {
    const { name, city, province, country, latitude, longitude } = req.body;

    // Kiểm tra trùng lặp (trùng tên và trùng tỉnh, không phân biệt hoa thường)
    const existingLocation = await Location.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      province: { $regex: new RegExp(`^${province}$`, 'i') },
      isDeleted: false,
    });

    if (existingLocation) {
      return sendResponse(res, 409, null, false, [
        'Địa điểm này đã tồn tại trong hệ thống',
      ]);
    }

    const newLocation = new Location({
      name,
      city,
      province,
      country: country || 'Vietnam',
      latitude,
      longitude,
    });

    await newLocation.save();

    // Loại bỏ các trường nội bộ trước khi trả về
    const locationResponse = newLocation.toObject();
    delete locationResponse.isDeleted;
    delete locationResponse.deletedAt;
    delete locationResponse.deletedBy;

    return sendResponse(res, 201, locationResponse, true, [
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

    // Nếu có cập nhật tên hoặc tỉnh, kiểm tra xem có bị trùng với địa điểm khác không
    if (name || province) {
      const locationToUpdate = await Location.findById(id);
      if (!locationToUpdate) {
        return sendResponse(res, 404, null, false, ['Không tìm thấy địa điểm']);
      }

      const checkName = name || locationToUpdate.name;
      const checkProvince = province || locationToUpdate.province;

      const existingLocation = await Location.findOne({
        _id: { $ne: id }, // Bỏ qua chính nó
        name: { $regex: new RegExp(`^${checkName}$`, 'i') },
        province: { $regex: new RegExp(`^${checkProvince}$`, 'i') },
        isDeleted: false,
      });

      if (existingLocation) {
        return sendResponse(res, 409, null, false, [
          'Tên địa điểm này đã tồn tại trong cùng tỉnh/thành phố',
        ]);
      }
    }

    const updatedLocation = await Location.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { name, city, province, country, latitude, longitude } },
      { new: true, runValidators: true },
    )
      .select('-deletedAt -deletedBy -isDeleted')
      .lean();

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

    const deletedLocation = await Location.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: req.user.id,
        },
      },
      { new: true },
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
