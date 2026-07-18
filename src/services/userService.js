import { User } from '../models/userModel.js';
import { mongooseToObject } from '../helpers/mongooseToObject.js';
import roleService from './roleService.js';

const createUser = async (
  full_name,
  email,
  phone,
  password,
  roleName = 'customer'
) => {
  const role = await roleService.getRoleByName(roleName);

  if (!role) {
    throw new Error(`Role '${roleName}' does not exist`);
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  const existingPhone = await User.findOne({ phone });

  if (existingPhone) {
    throw new Error('Phone already exists');
  }

  const user = new User({
    full_name,
    email,
    phone,
    password,
    role: role.id,
  });

  await user.save();

  return mongooseToObject(user);
};

const getUserByEmailOrPhone = async (identifier) => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).lean();

  return mongooseToObject(user);
};

const getUserById = async (id) => {
  const user = await User.findById(id).lean();
  return mongooseToObject(user);
};

const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  return mongooseToObject(user);
};

export default {
  createUser,
  getUserByEmailOrPhone,
  getUserById,
  updateUser,
};
