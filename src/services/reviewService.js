import { Review } from '../models/reviewModel.js';
import { Booking } from '../models/bookingModel.js';
import { Property } from '../models/propertyModel.js';

const updatePropertyRating = async (propertyId) => {
  const reviews = await Review.find({
    property_id: propertyId,
    status: 'approved',
    isDeleted: false,
  });

  const reviewCount = reviews.length;
  let avgRating = 0;

  if (reviewCount > 0) {
    const totalScore = reviews.reduce(
      (sum, review) => sum + review.overall_score,
      0,
    );
    avgRating = parseFloat((totalScore / reviewCount).toFixed(1)); // Làm tròn 1 chữ số thập phân
  }

  await Property.findByIdAndUpdate(propertyId, {
    review_count: reviewCount,
    avg_rating: avgRating,
  });
};

const createReview = async (data, userId) => {
  const {
    booking_id,
    comment,
    cleanliness_score,
    service_score,
    location_score,
    value_score,
  } = data;
  let overall_score = data.overall_score;

  const booking = await Booking.findOne({ _id: booking_id, isDeleted: false });
  if (!booking) throw new Error('Không tìm thấy Booking');
  if (booking.user_id.toString() !== userId)
    throw new Error('Bạn không có quyền đánh giá Booking này');
  if (booking.status !== 'completed')
    throw new Error('Bạn chỉ có thể đánh giá sau khi chuyến đi đã hoàn thành');

  const existingReview = await Review.findOne({ booking_id, isDeleted: false });
  if (existingReview) throw new Error('Bạn đã đánh giá cho Booking này rồi');

  const subScores = [
    cleanliness_score,
    service_score,
    location_score,
    value_score,
  ].filter((score) => score !== undefined && score !== null);
  if (subScores.length > 0) {
    const sum = subScores.reduce((a, b) => a + b, 0);
    overall_score = parseFloat((sum / subScores.length).toFixed(1));
  }

  const review = new Review({
    booking_id,
    user_id: userId,
    property_id: booking.property_id,
    overall_score,
    cleanliness_score,
    service_score,
    location_score,
    value_score,
    comment,
    status: 'approved', // Mặc định hiển thị, admin có thể ẩn sau
  });

  await review.save();

  await updatePropertyRating(booking.property_id);

  return review;
};

const getPropertyReviews = async (propertyId, query = {}) => {
  return await Review.find({
    property_id: propertyId,
    status: 'approved',
    isDeleted: false,
    ...query,
  })
    .populate('user_id', 'full_name avatar')
    .populate('reply.owner_id', 'full_name')
    .sort({ created_at: -1 })
    .lean();
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOne({ _id: reviewId, isDeleted: false });
  if (!review) throw new Error('Không tìm thấy đánh giá');

  if (review.user_id.toString() !== userId)
    throw new Error('Bạn không có quyền xóa đánh giá này');

  review.isDeleted = true;
  review.deletedAt = new Date();
  review.deletedBy = userId;
  await review.save();

  await updatePropertyRating(review.property_id);

  return review;
};

const replyToReview = async (reviewId, content, userId, userRole) => {
  const review = await Review.findOne({ _id: reviewId, isDeleted: false });
  if (!review) throw new Error('Không tìm thấy đánh giá');

  if (userRole !== 'admin') {
    const property = await Property.findById(review.property_id).lean();
    if (property.owner_id.toString() !== userId) {
      throw new Error('Bạn không có quyền phản hồi đánh giá này');
    }
  }

  review.reply = {
    owner_id: userId,
    content,
    replied_at: new Date(),
  };

  await review.save();
  return review;
};

const updateReviewStatus = async (reviewId, status) => {
  const review = await Review.findOne({ _id: reviewId, isDeleted: false });
  if (!review) throw new Error('Không tìm thấy đánh giá');

  const oldStatus = review.status;
  review.status = status;
  await review.save();

  if (
    (oldStatus === 'approved' && status !== 'approved') ||
    (oldStatus !== 'approved' && status === 'approved')
  ) {
    await updatePropertyRating(review.property_id);
  }

  return review;
};

export default {
  createReview,
  getPropertyReviews,
  deleteReview,
  replyToReview,
  updateReviewStatus,
};
