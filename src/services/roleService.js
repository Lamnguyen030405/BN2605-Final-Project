import { Role } from '../models/roleModel.js';
import { mongooseToObject } from '../helpers/mongooseToObject.js';

const createRole = async ({ name, description }) => {
  const existingRole = await Role.findOne({ name });

  if (existingRole) {
    throw new Error('Role already exists');
  }

  const role = new Role({
    name,
    description,
  });

  await role.save();

  return mongooseToObject(role);
};

const getRoleByName = async (name) => {
  return mongooseToObject(await Role.findOne({ name }).lean());
};

const getAllRoles = async () => {
  return mongooseToObject(await Role.find().lean());
};

const updateRole = async (id, updates) => {
  return mongooseToObject(
    await Role.findByIdAndUpdate(id, updates, { new: true })
  );
};

const deleteRole = async (id) => {
  return mongooseToObject(await Role.findByIdAndDelete(id));
};

export default {
  createRole,
  getRoleByName,
  getAllRoles,
  updateRole,
  deleteRole,
};
