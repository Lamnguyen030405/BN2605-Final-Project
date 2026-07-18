import { sendResponse } from '../helpers/sendResponse.js';
import roleService from '../services/roleService.js';

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new Error('Missing required field');
    }

    const role = await roleService.createRole({ name, description });

    return sendResponse(res, 201, role, true, 'Role created successfully');
  } catch (err) {
    return sendResponse(res, err.statusCode || 500, null, false, err.message);
  }
};

export { createRole };
