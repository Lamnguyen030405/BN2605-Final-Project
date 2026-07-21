import { Wishlist } from '../models/wishlistModel.js';
import { Property } from '../models/propertyModel.js';

const getMyWishlist = async (userId) => {
  return await Wishlist.find({ user_id: userId, isDeleted: false })
    .populate({
      path: 'property_id',
      select: 'name images base_price avg_rating location_id type',
      populate: { path: 'location_id', select: 'name' },
    })
    .sort({ added_at: -1 })
    .lean();
};

const addToWishlist = async (propertyId, userId) => {
  const property = await Property.findOne({
    _id: propertyId,
    isDeleted: false,
  });
  if (!property) throw new Error('Không tìm thấy cơ sở lưu trú');

  const existing = await Wishlist.findOne({
    user_id: userId,
    property_id: propertyId,
    isDeleted: false,
  });
  if (existing)
    throw new Error('Cơ sở lưu trú này đã có trong danh sách yêu thích');

  const wishlistItem = new Wishlist({
    user_id: userId,
    property_id: propertyId,
  });

  await wishlistItem.save();
  return wishlistItem;
};

const removeFromWishlist = async (propertyId, userId) => {
  const wishlistItem = await Wishlist.findOne({
    user_id: userId,
    property_id: propertyId,
    isDeleted: false,
  });
  if (!wishlistItem)
    throw new Error('Không tìm thấy trong danh sách yêu thích');

  wishlistItem.isDeleted = true;
  wishlistItem.deletedAt = new Date();
  wishlistItem.deletedBy = userId;

  await wishlistItem.save();
  return wishlistItem;
};

export default { getMyWishlist, addToWishlist, removeFromWishlist };
