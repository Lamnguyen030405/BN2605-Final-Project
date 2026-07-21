import { Property } from '../models/propertyModel.js';
import '../models/amenityModel.js';

const getAllProperties = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    location_id,
    type,
    min_price,
    max_price,
    search,
    sort_by = 'newest',
    amenities,
  } = queryParams;

  const filter = { isDeleted: false, isActive: true };

  if (location_id) filter.location_id = location_id;
  if (type) filter.type = type;

  if (min_price || max_price) {
    filter.base_price = {};
    if (min_price) filter.base_price.$gte = Number(min_price);
    if (max_price) filter.base_price.$lte = Number(max_price);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
    ];
  }

  if (amenities) {
    const amenityArray = amenities.split(',').map((id) => id.trim());
    filter.amenities = { $all: amenityArray }; // Tìm property có TẤT CẢ các amenities này
  }

  const sortOption = {};
  switch (sort_by) {
    case 'price_asc':
      sortOption.base_price = 1;
      break;
    case 'price_desc':
      sortOption.base_price = -1;
      break;
    case 'rating_desc':
      sortOption.avg_rating = -1;
      break;
    case 'newest':
    default:
      sortOption.created_at = -1;
      break;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [properties, totalCount] = await Promise.all([
    Property.find(filter)
      .select('-deletedAt -deletedBy -isDeleted')
      .populate('location_id', 'name province')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Property.countDocuments(filter),
  ]);

  return {
    data: properties,
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(totalCount / Number(limit)),
    },
  };
};

const getPropertyById = async (id) => {
  return await Property.findOne({ _id: id, isDeleted: false })
    .select('-deletedAt -deletedBy -isDeleted')
    .populate('location_id', 'name city province')
    .populate('owner_id', 'full_name email phone')
    .populate('amenities', 'name icon')
    .lean();
};

const createProperty = async (data) => {
  const newProperty = new Property(data);
  await newProperty.save();

  const result = newProperty.toObject();
  delete result.isDeleted;
  delete result.deletedAt;
  delete result.deletedBy;

  return result;
};

const updateProperty = async (id, data, userId, userRole) => {
  const property = await Property.findOne({ _id: id, isDeleted: false });

  if (!property) {
    return null; // Not found
  }

  if (userRole !== 'admin' && property.owner_id.toString() !== userId) {
    throw new Error('Bạn không có quyền cập nhật tài sản này');
  }

  const updatedProperty = await Property.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { new: true, runValidators: true },
  )
    .select('-deletedAt -deletedBy -isDeleted')
    .lean();

  return updatedProperty;
};

const deleteProperty = async (id, userId, userRole) => {
  const property = await Property.findOne({ _id: id, isDeleted: false });

  if (!property) {
    return null; // Not found
  }

  if (userRole !== 'admin' && property.owner_id.toString() !== userId) {
    throw new Error('Bạn không có quyền xóa tài sản này');
  }

  const deletedProperty = await Property.findOneAndUpdate(
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

  return deletedProperty;
};

export default {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
