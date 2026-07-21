import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../models/userModel.js';
import { sendResponse } from '../helpers/sendResponse.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendResponse(
      res,
      401,
      null,
      false,
      'Vui lòng đăng nhập để tiếp tục',
    );
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return sendResponse(
          res,
          401,
          null,
          false,
          'Phiên đăng nhập đã hết hạn',
        );
      }
      return sendResponse(
        res,
        401,
        null,
        false,
        'Token không hợp lệ hoặc đã hết hạn',
      );
    }
    req.user = user;
    next();
  });
};

export const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

const checkRole = (allowedRoles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('role').lean();

    if (!user || !user.role || !allowedRoles.includes(user.role.name)) {
      return sendResponse(
        res,
        403,
        null,
        false,
        'Bạn không có quyền thực hiện thao tác này',
      );
    }

    next();
  } catch (error) {
    return sendResponse(res, 500, null, false, [
      'Lỗi máy chủ nội bộ',
      error.message,
    ]);
  }
};

export const isOwner = checkRole(['owner']);
export const isAdmin = checkRole(['admin']);
export const isOwnerOrAdmin = checkRole(['admin', 'owner']);
