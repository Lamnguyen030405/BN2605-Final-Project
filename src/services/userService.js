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
    return { status: 400, message: `Role '${roleName}' does not exist` };
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
    isDeleted: false,
  }).lean();

  return mongooseToObject(user);
};

const getUserById = async (id) => {
  const user = await User.findOne({ _id: id, isDeleted: false }).lean();
  return mongooseToObject(user);
};

const updateUser = async (id, updateData) => {
  const user = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  return mongooseToObject(user);
};

export default {
  createUser,
  getUserByEmailOrPhone,
  getUserById,
  updateUser,
};
