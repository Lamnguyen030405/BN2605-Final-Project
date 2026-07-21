import reviewService from '../services/reviewService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body, req.user.id);
    return sendResponse(res, 201, review, true, ['Tạo đánh giá thành công']);
  } catch (error) {
    if (error.message.includes('quyền') || error.message.includes('hoàn thành')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    if (error.message.includes('đã đánh giá')) {
      return sendResponse(res, 400, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getPropertyReviews(req.params.propertyId, req.query);
    return sendResponse(res, 200, reviews, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await reviewService.deleteReview(req.params.id, req.user.id);
    return sendResponse(res, 200, review, true, ['Đã xóa đánh giá']);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const replyToReview = async (req, res) => {
  try {
    const userRole = req.user.role?.name || 'customer';
    const review = await reviewService.replyToReview(req.params.id, req.body.content, req.user.id, userRole);
    return sendResponse(res, 200, review, true, ['Đã phản hồi đánh giá']);
  } catch (error) {
    if (error.message.includes('quyền')) {
      return sendResponse(res, 403, null, false, [error.message]);
    }
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const review = await reviewService.updateReviewStatus(req.params.id, req.body.status);
    return sendResponse(res, 200, review, true, ['Cập nhật trạng thái đánh giá thành công']);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export default {
  createReview,
  getPropertyReviews,
  deleteReview,
  replyToReview,
  updateReviewStatus
};
