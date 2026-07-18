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
  role = 'customer'
) => {
  try {
    // Normalize input
    full_name = full_name.trim();
    email = email.trim().toLowerCase();
    phone = phone.trim();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { status: 400, message: 'Invalid email format.' };
    }

    // Validate password
    if (password.length < 8) {
      return {
        status: 400,
        message: 'Password must be at least 8 characters.',
      };
    }

    const existingUser = await userService.getUserByEmailOrPhone(email, phone);
    if (existingUser) {
      if (existingUser.isDeleted) {
        return { status: 403, message: 'Account has been deleted' };
      }
      return {
        status: 409,
        message: 'User with this email or phone already exists',
      };
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Generate OTP for account activation
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
      message: 'Registration OTP sent successfully',
      data: { email },
    };
  } catch (error) {
    throw error;
  }
};

const verifyOtp = async (email, otpCode) => {
  try {
    const pendingData = pendingRegistrations.get(email);

    if (!pendingData) {
      return {
        status: 404,
        message: 'No pending registration found for this email.',
      };
    }

    // Check if OTP has expired
    if (Date.now() > pendingData.expiredAt) {
      pendingRegistrations.delete(email);
      return {
        status: 400,
        message: 'OTP has expired. Please request a new one.',
      };
    }

    // Verify OTP code
    if (pendingData.otpCode !== otpCode) {
      return { status: 400, message: 'Invalid OTP code.' };
    }

    // Create user in database
    const user = await userService.createUser(
      pendingData.full_name,
      pendingData.email,
      pendingData.phone,
      pendingData.password,
      pendingData.role
    );

    if (user && user.status) {
      return user;
    }

    // Remove from pending registrations
    pendingRegistrations.delete(email);

    return {
      status: 200,
      data: user,
    };
  } catch (error) {
    throw error;
  }
};

const login = async (identifier, password) => {
  try {
    const user = await userService.getUserByEmailOrPhone(identifier);
    if (!user) {
      return { status: 404, message: 'Invalid email or phone number' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { status: 401, message: 'Invalid password' };
    }

    if (user.isDeleted) {
      return { status: 403, message: 'Account has been deleted' };
    }

    if (!user.is_active) {
      return { status: 403, message: 'Account is not activated' };
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
    });

    // Save refresh token to database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const newRefreshToken = new RefreshToken({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt,
    });

    await newRefreshToken.save();

    let redirectUrl = '/';
    if (user.role_id === 1 || user.role?.role_name === 'admin') {
      redirectUrl = '/admin';
    } else if (user.role_id === 2 || user.role?.role_name === 'owner') {
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
          role: user.role?.role_name || 'customer',
        },
        redirectUrl,
      },
    };
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (token) => {
  try {
    // Find refresh token in database
    const refreshTokenRecord = await RefreshToken.findOne({
      token,
      is_revoked: false,
    });

    if (!refreshTokenRecord) {
      return {
        status: 401,
        message: 'Invalid refresh token',
      };
    }

    // Check if token is expired
    if (new Date() > new Date(refreshTokenRecord.expires_at)) {
      return {
        status: 401,
        message: 'Refresh token expired',
      };
    }

    // Revoke old token
    refreshTokenRecord.is_revoked = true;
    await refreshTokenRecord.save();

    // Get user
    const user = await userService.getUserById(refreshTokenRecord.user_id);

    if (!user) {
      return {
        status: 404,
        message: 'User not found',
      };
    }

    if (user.isDeleted) {
      return { status: 403, message: 'Account has been deleted' };
    }

    if (!user.isActive) {
      return { status: 403, message: 'Account is not activated' };
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
    });

    // Save new refresh token
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
      message: 'Token refreshed',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default {
  register,
  login,
  verifyOtp,
  refreshToken,
};
