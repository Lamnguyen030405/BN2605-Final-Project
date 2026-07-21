import { Location } from '../models/locationModel.js';

const getAllLocations = async () => {
  return await Location.find({ isDeleted: false })
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();
};

const getLocationById = async (id) => {
  return await Location.findById(id).lean();
};

const checkDuplicateLocation = async (name, province, excludeId = null) => {
  const query = {
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    province: { $regex: new RegExp(`^${province}$`, 'i') },
    isDeleted: false,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return await Location.findOne(query).lean();
};

const createLocation = async (data) => {
  const newLocation = new Location(data);
  await newLocation.save();

  const result = newLocation.toObject();
  delete result.isDeleted;
  delete result.deletedAt;
  delete result.deletedBy;

  return result;
};

const updateLocation = async (id, data) => {
  return await Location.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: data },
    { new: true, runValidators: true },
  )
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();
};

const deleteLocation = async (id, deletedBy) => {
  return await Location.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
      },
    },
    { new: true },
  ).lean();
};

export default {
  getAllLocations,
  getLocationById,
  checkDuplicateLocation,
  createLocation,
  updateLocation,
  deleteLocation,
};
