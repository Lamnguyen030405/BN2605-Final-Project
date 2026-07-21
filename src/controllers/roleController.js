import { sendResponse } from '../helpers/sendResponse.js';
import roleService from '../services/roleService.js';

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const roleResponse = await roleService.createRole({ name, description });

    if (roleResponse.status) {
      return sendResponse(res, roleResponse.status, null, false, [
        roleResponse.message,
      ]);
    }

    return sendResponse(res, 201, roleResponse, true, ['Tạo quyền thành công']);
  } catch (err) {
    return sendResponse(res, 500, null, false, [err.message]);
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    return sendResponse(res, 200, roles, true);
  } catch (err) {
    return sendResponse(res, 500, null, false, [err.message]);
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedRole = await roleService.updateRole(id, { name, description });

    if (!updatedRole) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy quyền này']);
    }

    return sendResponse(res, 200, updatedRole, true, [
      'Cập nhật quyền thành công',
    ]);
  } catch (err) {
    return sendResponse(res, 500, null, false, [err.message]);
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRole = await roleService.deleteRole(id, req.user.id);

    if (!deletedRole) {
      return sendResponse(res, 404, null, false, ['Không tìm thấy quyền này']);
    }

    return sendResponse(res, 200, null, true, ['Xóa quyền thành công']);
  } catch (err) {
    return sendResponse(res, 500, null, false, [err.message]);
  }
};

export default { createRole, getAllRoles, updateRole, deleteRole };
