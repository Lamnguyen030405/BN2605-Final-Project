import wishlistService from '../services/wishlistService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistService.getMyWishlist(req.user.id);
    return sendResponse(res, 200, wishlist, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistService.addToWishlist(
      req.body.property_id,
      req.user.id,
    );
    return sendResponse(res, 201, wishlist, true, [
      'Đã thêm vào danh sách yêu thích',
    ]);
  } catch (error) {
    if (error.message.includes('đã có')) {
      return sendResponse(res, 400, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistService.removeFromWishlist(
      req.params.propertyId,
      req.user.id,
    );
    return sendResponse(res, 200, wishlist, true, [
      'Đã xóa khỏi danh sách yêu thích',
    ]);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export default { getMyWishlist, addToWishlist, removeFromWishlist };
