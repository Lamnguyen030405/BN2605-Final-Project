import authService from '../services/authService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return sendResponse(res, 400, null, false, [
      'Identifier and password are required',
    ]);
  }

  try {
    const response = await authService.login(identifier, password);

    // Lưu refreshToken vào cookie httpOnly từ HEAD
    if (response.status === 200 && response.data?.refreshToken) {
      res.cookie('refreshToken', response.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    if (response.status !== 200) {
      return sendResponse(res, response.status, null, false, [
        response.message,
      ]);
    }

    return sendResponse(
      res,
      response.status,
      {
        token: response.data.token,
        user: response.data.user,
        redirectUrl: response.data.redirectUrl,
      },
      response.success,
    );
  } catch (error) {
    return sendResponse(res, 500, null, false, [
      'Error logging in',
      error.message,
    ]);
  }
};

const register = async (req, res) => {
  const { full_name, email, phone, password, role } = req.body;

  try {
    // Validate required fields
    if (!full_name || !email || !phone || !password) {
      throw new Error('All required fields are required.');
    }

    const response = await authService.register(
      full_name,
      email,
      phone,
      password,
      role,
    );

    if (response.status && response.status !== 200) {
      return sendResponse(res, response.status, null, false, [
        response.message,
      ]);
    }

    return sendResponse(
      res,
      response.status || 201,
      response.data || response,
      true,
    );
  } catch (error) {
    return sendResponse(res, 500, null, false, [
      'Error creating user',
      error.message,
    ]);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      throw new Error('Missing required fields');
    }

    const response = await authService.verifyOtp(email, otpCode);

    if (response.status && response.status !== 200) {
      return sendResponse(res, response.status, null, false, [
        response.message,
      ]);
    }

    return sendResponse(res, 200, { user: response.data || response }, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [
      'Error verifying OTP',
      error.message,
    ]);
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return sendResponse(res, 400, null, false, ['Refresh token is required']);
    }

    const response = await authService.refreshToken(refreshToken);

    if (response.status && response.status !== 200) {
      return sendResponse(res, response.status, null, false, [
        response.message,
      ]);
    }

    if (response.status === 200 && response.data?.refreshToken) {
      res.cookie('refreshToken', response.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return sendResponse(res, response.status || 200, response.data, true);
  } catch (error) {
    return sendResponse(res, 500, null, false, [
      'Error refreshing token',
      error.message,
    ]);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    return sendResponse(res, 200, null, true, 'Logout successful');
  } catch (error) {
    return sendResponse(res, 500, null, false, [
      'Logout failed',
      error.message,
    ]);
  }
};

export default { login, register, verifyOTP, logout, refresh };
