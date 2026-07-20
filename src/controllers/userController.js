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
      { new: true, runValidators: true },
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
      return sendResponse(res, 400, null, false, [
        'Mật khẩu cũ không chính xác',
      ]);
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select('-password -deletedAt -isDeleted')
      .populate('role', 'name description')
      .lean();

    return sendResponse(res, 200, users, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user || user.isDeleted) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy người dùng']);
    }

    // Không cho phép admin tự khóa tài khoản của chính mình
    if (user._id.toString() === req.user.id) {
      return sendResponse(res, 400, null, false, [
        'Không thể tự khóa tài khoản của chính mình',
      ]);
    }

    user.isActive = isActive;
    await user.save();

    const action = isActive ? 'Mở khóa' : 'Khóa';
    return sendResponse(res, 200, null, true, [
      `${action} tài khoản thành công`,
    ]);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.isDeleted) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy người dùng']);
    }

    if (user._id.toString() === req.user.id) {
      return sendResponse(res, 400, null, false, [
        'Không thể tự xóa tài khoản của chính mình',
      ]);
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user.id;
    await user.save();

    return sendResponse(res, 200, null, true, ['Xóa tài khoản thành công']);
  } catch (error) {
    return sendResponse(res, 500, null, false, [error.message]);
  }
};

export {
  getProfile,
  updateProfile,
  updatePassword,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
};
