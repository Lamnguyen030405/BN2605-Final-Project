import { Amenity } from '../models/amenityModel.js';

const getAllAmenities = async () => {
  return await Amenity.find({ isDeleted: false }).sort({ category: 1, name: 1 }).lean();
};

const createAmenity = async (data) => {
  const existing = await Amenity.findOne({ name: data.name, isDeleted: false });
  if (existing) throw new Error('Tiện ích này đã tồn tại');

  const amenity = new Amenity(data);
  await amenity.save();
  return amenity;
};

export default { getAllAmenities, createAmenity };
