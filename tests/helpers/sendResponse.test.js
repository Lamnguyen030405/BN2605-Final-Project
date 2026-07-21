import { jest } from '@jest/globals';
import { sendResponse } from '../../src/helpers/sendResponse.js';

describe('Helpers - sendResponse', () => {
  let mockRes;

  // Chạy trước mỗi test case để reset lại mock response object
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('nên trả về đúng format khi isSuccess = true', () => {
    const data = { user: 'Test' };
    sendResponse(mockRes, 200, data, true, ['Đăng nhập thành công']);

    // Kiểm tra status code
    expect(mockRes.status).toHaveBeenCalledWith(200);

    // Kiểm tra JSON trả về
    expect(mockRes.json).toHaveBeenCalledWith({
      data: { user: 'Test' },
      isSuccess: true,
      message: 'Đăng nhập thành công',
      errors: [], // Phải là mảng rỗng khi success
    });
  });

  it('nên tự động lấy message mặc định nếu không truyền message', () => {
    sendResponse(mockRes, 200, null, true);

    expect(mockRes.json).toHaveBeenCalledWith({
      data: null,
      isSuccess: true,
      message: 'Thành công',
      errors: [],
    });
  });

  it('nên nhét các chuỗi lỗi vào mảng errors khi isSuccess = false', () => {
    sendResponse(mockRes, 400, null, false, ['Lỗi 1', 'Lỗi 2']);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: null,
      isSuccess: false,
      message: 'Lỗi 1',
      errors: ['Lỗi 1', 'Lỗi 2'],
    });
  });

  it('nên xử lý đúng nếu errors không phải là mảng', () => {
    sendResponse(mockRes, 500, null, false, 'Lỗi server nghiêm trọng');

    expect(mockRes.json).toHaveBeenCalledWith({
      data: null,
      isSuccess: false,
      message: 'Lỗi server nghiêm trọng',
      errors: ['Lỗi server nghiêm trọng'], // Tự động bọc vào mảng
    });
  });
});
