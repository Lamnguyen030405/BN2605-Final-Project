import { User } from '../models/userModel.js';
import { sendResponse } from '../helpers/sendResponse.js';
import bcrypt from 'bcrypt';

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -deletedAt -isDeleted')
      .populate('role', 'name description')
      .lean();

    if (!user) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy người dùng']);
    }

    return sendResponse(res, 200, user, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, gender, dateOfBirth } = req.body;
    const updateData = { full_name, phone, gender, dateOfBirth };

    // Nếu người dùng upload file mới, Multer sẽ gán URL vào req.file.path
    if (req.file) {
      updateData.avatar = req.file.path;
    } else if (req.body.avatar) {
      // Nếu không upload file mới nhưng có truyền link url cũ (hoặc link ngoài)
      updateData.avatar = req.body.avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select('-password -deletedAt -isDeleted')
      .populate('role', 'name description')
      .lean();

    if (!updatedUser) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy người dùng']);
    }

    return sendResponse(res, 200, updatedUser, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy người dùng']);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return sendResponse(res, 400, null, false, ['Mật khẩu cũ không chính xác']);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return sendResponse(res, 200, null, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export { getProfile, updateProfile, updatePassword };
