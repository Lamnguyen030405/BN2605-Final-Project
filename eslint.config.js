import js from '@eslint/js';
import globals from 'globals';

export default [
  // Áp dụng bộ rule mặc định của ESLint
  js.configs.recommended,

  {
    files: ['**/*.js', '**/*.mjs'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      // Khai báo các global của môi trường Node.js
      globals: {
        ...globals.node,
      },
    },

    rules: {
      // Ưu tiên const nếu biến không bị gán lại
      'prefer-const': 'error',

      // Cảnh báo khi sử dụng console.log
      'no-console': 'warn',

      // Không cho phép dùng var
      'no-var': 'error',

      // Báo lỗi biến hoặc tham số không sử dụng
      'no-unused-vars': ['error'],

      // Bắt buộc dùng dấu chấm phẩy
      semi: ['error', 'always'],

      // Bắt buộc dùng === thay vì ==
      eqeqeq: ['error', 'always'],

      // Bắt buộc dùng dấu nháy đơn
      quotes: ['error', 'single'],

      // Bắt buộc dùng dấu phẩy cuối ở object/array nhiều dòng
      'comma-dangle': ['error', 'always-multiline'],

      // Luôn có xuống dòng cuối file
      'eol-last': ['error', 'always'],

      // Không có khoảng trắng thừa
      'no-trailing-spaces': 'error',

      // Cách thụt lề 2 khoảng trắng
      indent: ['error', 2],
    },
  },
];
