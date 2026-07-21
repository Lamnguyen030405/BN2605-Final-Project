import bcrypt from 'bcrypt';
import userService from './userService.js';
import crypto from 'crypto';
import emailService from '../utils/emailService.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { RefreshToken } from '../models/refreshTokenModel.js';
const pendingRegistrations = new Map();

const register = async (
  full_name,
  email,
  phone,
  password,
  role = 'customer',
) => {
  try {
    full_name = full_name.trim();
    email = email.trim().toLowerCase();
    phone = phone.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { status: 400, message: 'Định dạng email không hợp lệ.' };
    }

    if (password.length < 8) {
      return {
        status: 400,
        message: 'Mật khẩu phải chứa ít nhất 8 ký tự.',
      };
    }

    const existingUser = await userService.getUserByEmailOrPhone(email, phone);
    if (existingUser) {
      if (existingUser.isDeleted) {
        return { status: 403, message: 'Tài khoản đã bị xóa' };
      }
      return {
        status: 409,
        message: 'Email hoặc số điện thoại đã tồn tại',
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiredAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    pendingRegistrations.set(email, {
      full_name,
      email,
      phone,
      password: hashPassword,
      otpCode,
      expiredAt,
      role,
    });

    await emailService.sendRegistrationOtp(email, otpCode);

    return {
      status: 200,
      message: 'Mã OTP đăng ký đã được gửi thành công',
      data: { email },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const verifyOtp = async (email, otpCode) => {
  try {
    const pendingData = pendingRegistrations.get(email);

    if (!pendingData) {
      return {
        status: 404,
        message: 'Không tìm thấy đăng ký nào đang chờ với email này.',
      };
    }

    if (Date.now() > pendingData.expiredAt) {
      pendingRegistrations.delete(email);
      return {
        status: 400,
        message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.',
      };
    }

    if (pendingData.otpCode !== otpCode) {
      return { status: 400, message: 'Mã OTP không hợp lệ.' };
    }

    const user = await userService.createUser(
      pendingData.full_name,
      pendingData.email,
      pendingData.phone,
      pendingData.password,
      pendingData.role,
    );

    if (user && user.status) {
      return user;
    }

    pendingRegistrations.delete(email);

    return {
      status: 200,
      data: user,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const login = async (identifier, password) => {
  try {
    const user = await userService.getUserByEmailOrPhone(identifier);
    if (!user) {
      return { status: 404, message: 'Email hoặc số điện thoại không hợp lệ' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { status: 401, message: 'Mật khẩu không chính xác' };
    }

    if (user.isDeleted) {
      return { status: 403, message: 'Tài khoản đã bị xóa' };
    }

    if (!user.isActive) {
      return { status: 403, message: 'Tài khoản chưa được kích hoạt' };
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: { role_name: user.role?.name },
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const newRefreshToken = new RefreshToken({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt,
    });

    await newRefreshToken.save();

    let redirectUrl = '/';
    if (user.role_id === 1 || user.role?.name === 'admin') {
      redirectUrl = '/admin';
    } else if (user.role_id === 2 || user.role?.name === 'owner') {
      redirectUrl = '/owner';
    }
    return {
      status: 200,
      success: true,
      data: {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role?.name || 'customer',
        },
        redirectUrl,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const refreshToken = async (token) => {
  try {
    const refreshTokenRecord = await RefreshToken.findOne({
      token,
      is_revoked: false,
    });

    if (!refreshTokenRecord) {
      return {
        status: 401,
        message: 'Refresh token không hợp lệ',
      };
    }

    if (new Date() > new Date(refreshTokenRecord.expires_at)) {
      return {
        status: 401,
        message: 'Refresh token đã hết hạn',
      };
    }

    refreshTokenRecord.is_revoked = true;
    await refreshTokenRecord.save();

    const user = await userService.getUserById(refreshTokenRecord.user_id);

    if (!user) {
      return {
        status: 404,
        message: 'Không tìm thấy người dùng',
      };
    }

    if (user.isDeleted) {
      return { status: 403, message: 'Tài khoản đã bị xóa' };
    }

    if (!user.isActive) {
      return { status: 403, message: 'Tài khoản chưa được kích hoạt' };
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: { role_name: user.role?.name },
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const newRefreshTokenDoc = new RefreshToken({
      user_id: user.id,
      token: newRefreshToken,
      expires_at: expiresAt,
      is_revoked: false,
    });

    await newRefreshTokenDoc.save();

    return {
      status: 200,
      message: 'Làm mới token thành công',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  register,
  login,
  verifyOtp,
  refreshToken,
};
