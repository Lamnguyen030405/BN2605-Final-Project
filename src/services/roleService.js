import { Role } from '../models/roleModel.js';
import { mongooseToObject } from '../helpers/mongooseToObject.js';

const createRole = async ({ name, description }) => {
  const existingRole = await Role.findOne({ name, isDeleted: false });

  if (existingRole) {
    return { status: 409, message: 'Role already exists' };
  }

  const role = new Role({
    name,
    description,
  });

  await role.save();

  return mongooseToObject(role);
};

const getRoleByName = async (name) => {
  return mongooseToObject(
    await Role.findOne({ name, isDeleted: false }).lean(),
  );
};

const getAllRoles = async () => {
  return mongooseToObject(await Role.find({ isDeleted: false }).lean());
};

const updateRole = async (id, updates) => {
  return mongooseToObject(
    await Role.findOneAndUpdate({ _id: id, isDeleted: false }, updates, {
      new: true,
    }),
  );
};

const deleteRole = async (id, deletedBy) => {
  return mongooseToObject(
    await Role.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true },
    ),
  );
};

export default {
  createRole,
  getRoleByName,
  getAllRoles,
  updateRole,
  deleteRole,
};
