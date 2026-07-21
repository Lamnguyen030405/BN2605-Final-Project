import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../../src/utils/jwt.js';

describe('Utils - jwt', () => {
  const secretKey = 'test_secret';
  
  beforeAll(() => {
    process.env.ACCESS_TOKEN_SECRET = secretKey;
    process.env.REFRESH_TOKEN_SECRET = secretKey;
  });

  afterAll(() => {
    delete process.env.ACCESS_TOKEN_SECRET;
    delete process.env.REFRESH_TOKEN_SECRET;
  });

  describe('generateAccessToken', () => {
    it('nên tạo ra một JWT token chuỗi', () => {
      const payload = { id: '123', role: 'customer' };
      const token = generateAccessToken(payload);
      
      expect(typeof token).toBe('string');
      // Token JWT thường có 3 phần tách bằng dấu chấm
      expect(token.split('.').length).toBe(3);
    });
  });

  describe('verifyToken', () => {
    it('nên giải mã token hợp lệ và trả về payload (dùng jsonwebtoken trực tiếp vì utils chưa export hàm verify)', () => {
      const payload = { id: '123', role: 'customer' };
      const token = generateAccessToken(payload);
      
      const decoded = jwt.verify(token, secretKey);
      
      expect(decoded).toHaveProperty('id', '123');
      expect(decoded).toHaveProperty('role', 'customer');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('nên văng lỗi nếu token sai hoặc bị sửa đổi', () => {
      const badToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';
      
      expect(() => {
        jwt.verify(badToken, secretKey);
      }).toThrow();
    });
  });
});
