import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';
import { sendResponse } from '../helpers/sendResponse.js';

const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await userService.getUserByEmailOrPhone(identifier);
    if (!user) {
      return sendResponse(res, 401, null, false, [
        'Invalid email or phone number',
      ]);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, null, false, ['Invalid password']);
    }

    // Lưu ý: MongoDB dùng _id thay vì id
    const token = jwt.sign(
      { userId: user._id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Gắn token vào cookie
    res.cookie('jwt_token', token, { httpOnly: true, maxAge: 3600000 });

    // Trả về JSON thay vì redirect (Frontend sẽ tự lo việc chuyển trang)
    return sendResponse(
      res,
      200,
      { token, user: { id: user._id, role: user.role.name } },
      true
    );
  } catch (error) {
    console.error('Login Error:', error);
    return sendResponse(res, 500, null, false, [
      'Error logging in',
      error.message,
    ]);
  }
};

const register = async (req, res) => {
  const { full_name, email, phone, password, role } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userService.createUser(
      full_name,
      email,
      phone,
      hashPassword,
      role
    );

    return sendResponse(
      res,
      201,
      { userId: newUser.id, message: 'User created successfully!' },
      true
    );
  } catch (error) {
    console.error('Register Error:', error);
    return sendResponse(res, 500, null, false, [
      'Error creating user',
      error.message,
    ]);
  }
};

const logout = (req, res) => {
  // Nếu API của bạn thuần dùng JWT qua Cookie, bạn không cần đến req.session
  // Nhưng nếu bạn có kết hợp express-session, cấu trúc sẽ như sau:
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return sendResponse(res, 500, null, false, ['Logout failed']);
      }
      res.clearCookie('jwt_token');
      return sendResponse(res, 200, null, true);
    });
  } else {
    // Chỉ dùng JWT Cookie
    res.clearCookie('jwt_token');
    return sendResponse(res, 200, null, true);
  }
};

export { login, register, logout };
