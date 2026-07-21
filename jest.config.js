export default {
  // Chỉ định môi trường test là node (vì chúng ta test backend)
  testEnvironment: 'node',
  
  // Hỗ trợ import ES modules
  transform: {},
  
  // Cấu hình thư mục chứa test
  roots: ['<rootDir>/tests'],
  
  // Các file cần gom vào tính % coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',       // Bỏ qua file khởi chạy server
    '!src/routes/**',    // Thường bỏ qua routes vì router logic ít
    '!src/models/**'     // Bỏ qua models vì toàn schema
  ],
  
  // Thư mục lưu kết quả báo cáo coverage
  coverageDirectory: 'coverage',
  
  // Xóa console.log rác trong lúc chạy test (tuỳ chọn)
  // silent: true,
};
