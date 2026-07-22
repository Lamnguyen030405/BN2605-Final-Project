<div align="center">
  <h1 align="center">🏨 Travel Booking Platform API</h1>
  <h2 align="center">
    Hệ thống Backend (RESTful API) dành cho nền tảng Đặt phòng Khách sạn và Dịch vụ Du lịch.
  </h2>
  <p align="center">
    <b>Tác giả: Nguyễn Trí Lâm</b>
  </p>
  <br/>
</div>

---

## 🚀 Công nghệ & Công cụ (Tech Stack)

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier" />
</p>

- 🟢 **Runtime:** Node.js (phiên bản 20+)
- 🚂 **Framework:** Express.js
- 🍃 **Database:** MongoDB & Mongoose (NoSQL)
- 🔐 **Authentication:** JWT (JSON Web Tokens) với cơ chế Access/Refresh Token bảo mật
- ☁️ **Cloud Storage:** Cloudinary & Multer (Xử lý upload ảnh trực tiếp)
- 📧 **Mail Service:** Nodemailer (Hệ thống gửi mã OTP, thông báo tự động...)
- 🛡️ **Validation:** Joi (Bảo vệ dữ liệu đầu vào)
- 🧪 **Testing:** Jest (Bảo vệ luồng logic, chống lỗi hồi quy)
- 💅 **Code Quality:** ESLint & Prettier
- 🐳 **DevOps:** Docker & Docker Compose

---

## 🛠 Các Module cốt lõi

Hệ thống được thiết kế cực kỳ chặt chẽ với **9 Module** chính:

1. 🔐 **Module 1 (Auth):** Xác thực đa tầng (Đăng ký OTP qua Email, Login, Refresh Token bảo mật).
2. 👤 **Module 2 (User):** Quản lý hồ sơ người dùng, phân quyền hệ thống (Customer, Vendor, Admin).
3. 📍 **Module 3 (Location):** Hệ thống cấu trúc dữ liệu Tỉnh/Thành phố/Địa danh.
4. 🏨 **Module 4 (Property):** Quản lý Khách sạn, Khu nghỉ dưỡng, Điểm tham quan (Hỗ trợ lọc theo giá, điểm đánh giá, loại hình).
5. 🛏️ **Module 5 (Room/Ticket):** Quản lý chi tiết danh mục Phòng ở và Vé vào cổng.
6. 🛒 **Module 6 (Booking):** Logic đặt chỗ phức tạp, tính tiền tổng, chặn phòng trùng lặp, kiểm tra tình trạng trống (Availability).
7. ⭐ **Module 7 (Review):** Đánh giá trải nghiệm tự động cập nhật điểm Khách sạn, có cơ chế duyệt và ẩn bình luận cho Admin.
8. ❤️ **Module 8 (Wishlist):** Lưu trữ danh sách yêu thích cá nhân người dùng.
9. 🏊 **Module 9 (Amenity):** Quản lý kho dữ liệu các dịch vụ/tiện ích phụ trợ (Wifi, Hồ bơi, Bãi đậu xe...).

---

## ⚙️ Hướng dẫn cài đặt và chạy thử (Môi trường Local)

### Bước 1: Chuẩn bị mã nguồn

Clone dự án về máy và cài đặt các gói phụ thuộc (Dependencies).

```bash
git clone https://github.com/Lamnguyen030405/BN2605-Final-Project.git
cd BN2605-Final-Project
npm install
```

### Bước 2: Cấu hình biến môi trường

Sao chép file cấu hình mẫu và điền các thông tin bảo mật (Database, Cloudinary, Gmail) của bạn vào:

```bash
cp .env.example .env
```

> ⚠️ **Lưu ý:** Bạn bắt buộc phải cấu hình `MONGO_URI`, `MAIL_USER/PASS`, và bộ 3 khóa của `CLOUDINARY` để ứng dụng có thể hoạt động 100% công suất.

### Bước 3: Khởi chạy Server

Để chạy chế độ phát triển (Tự động tải lại mã nguồn khi có thay đổi):

```bash
npm run dev
```

🎉 Server sẽ chạy mặc định tại địa chỉ: `http://localhost:8080`

---

## 🐳 Hướng dẫn chạy bằng Docker

Dự án đã được bọc gọn gàng trong Container, giúp loại bỏ hoàn toàn lỗi môi trường "Máy tôi chạy được nhưng máy bạn thì không".

Chỉ cần bạn đã cài phần mềm Docker Desktop, hãy chạy dòng lệnh quyền lực này:

```bash
docker-compose up --build -d
```

Lệnh này sẽ tự động tải các hệ điều hành ảo, cài thư viện, gắn kết file `.env` vào bên trong và kích hoạt Server chạy ngầm một cách mượt mà.

---

## 🧪 Hướng dẫn chạy Test (Unit Test)

Dự án đề cao tính ổn định, nên đã được tích hợp bộ Test tự động với Jest (chạy trên môi trường ES Modules hiện đại).

Để chạy toàn bộ Test Case và xuất báo cáo độ phủ (Coverage), dùng lệnh:

```bash
npm run test:coverage
```

📈 _Báo cáo trực quan dạng giao diện Web sẽ được sinh ra ở thư mục `coverage/lcov-report/index.html`._

---

## 🧹 Chuẩn mực Format Code

Dự án tuân thủ nghiêm ngặt quy tắc Clean Code. Trước khi Commit mã nguồn mới lên Github, hãy chạy bộ công cụ định dạng để giữ form code chuẩn chỉnh:

- Tự động làm đẹp và sắp xếp dòng code: `npm run format`
- Bắt lỗi logic và cú pháp: `npm run lint`
