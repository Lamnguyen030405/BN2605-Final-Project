Ran command: `npm run lint`
Ran command: `npm run dev`
Viewed cloudinary.js:1-12

Dựa trên đề bài **Nền tảng Đặt phòng và Dịch vụ Du lịch** và toàn bộ các Model hiện có, đây là danh sách các API cốt lõi được phân nhóm theo từng Module:

---

## 🔐 Module 1: Xác thực (Auth)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `POST` | `/api/auth/register` | Đăng ký tài khoản | Public |
| `POST` | `/api/auth/verify-otp` | Xác thực OTP | Public |
| `POST` | `/api/auth/login` | Đăng nhập | Public |
| `POST` | `/api/auth/refresh` | Làm mới Access Token | Public |
| `POST` | `/api/auth/logout` | Đăng xuất | User |

✅ **Đã hoàn thành**

---

## 👤 Module 2: Người dùng (User)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `GET` | `/api/users/me` | Xem hồ sơ cá nhân | User |
| `PUT` | `/api/users/me` | Cập nhật hồ sơ + Upload avatar | User |
| `PUT` | `/api/users/me/password` | Đổi mật khẩu | User |
| `GET` | `/api/users` | Lấy danh sách tất cả User | Admin |
| `PATCH` | `/api/users/:id/status` | Khóa/Mở khóa tài khoản | Admin |
| `DELETE` | `/api/users/:id` | Xóa mềm tài khoản | Admin |

✅ **GET/PUT/PUT password đã hoàn thành** — còn lại cần làm

---

## 📍 Module 3: Địa điểm (Location)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `GET` | `/api/locations` | Lấy danh sách tỉnh/thành phố | Public |
| `POST` | `/api/locations` | Tạo địa điểm mới | Admin |
| `PUT` | `/api/locations/:id` | Cập nhật địa điểm | Admin |
| `DELETE` | `/api/locations/:id` | Xóa địa điểm | Admin |

---

## 🏨 Module 4: Cơ sở lưu trú / Điểm tham quan (Property)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `GET` | `/api/properties` | Tìm kiếm & Lọc (theo location, giá, rating, tiện ích, loại) | Public |
| `GET` | `/api/properties/:id` | Xem chi tiết Property | Public |
| `POST` | `/api/properties` | Tạo Property mới | Vendor/Admin |
| `PUT` | `/api/properties/:id` | Cập nhật thông tin + Ảnh | Vendor/Admin |
| `DELETE` | `/api/properties/:id` | Xóa mềm Property | Vendor/Admin |

---

## 🛏️ Module 5: Phòng (Room) / 🎫 Vé (Ticket)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `GET` | `/api/properties/:id/rooms` | Xem danh sách phòng của khách sạn | Public |
| `POST` | `/api/properties/:id/rooms` | Thêm loại phòng mới | Vendor/Admin |
| `PUT` | `/api/rooms/:id` | Cập nhật phòng | Vendor/Admin |
| `DELETE` | `/api/rooms/:id` | Xóa phòng | Vendor/Admin |
| `GET` | `/api/properties/:id/tickets` | Xem danh sách vé tham quan | Public |
| `POST` | `/api/properties/:id/tickets` | Thêm loại vé mới | Vendor/Admin |
| `PUT` | `/api/tickets/:id` | Cập nhật vé | Vendor/Admin |
| `DELETE` | `/api/tickets/:id` | Xóa vé | Vendor/Admin |

---

## 📅 Module 6: Đặt chỗ (Booking) ⭐ Quan trọng nhất
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `POST` | `/api/bookings` | Tạo booking mới (phòng hoặc vé tham quan) | User |
| `GET` | `/api/bookings` | Lịch sử booking của mình | User |
| `GET` | `/api/bookings/:id` | Chi tiết 1 booking | User |
| `PATCH` | `/api/bookings/:id/cancel` | Hủy booking | User |
| `GET` | `/api/admin/bookings` | Xem tất cả bookings | Admin |
| `PATCH` | `/api/admin/bookings/:id/status` | Cập nhật trạng thái booking | Admin |

---

## ⭐ Module 7: Đánh giá (Review)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `GET` | `/api/properties/:id/reviews` | Xem đánh giá của một Property | Public |
| `POST` | `/api/reviews` | Gửi đánh giá (phải có booking_id đã hoàn thành) | User |
| `DELETE` | `/api/reviews/:id` | Xóa đánh giá của mình | User |
| `PATCH` | `/api/reviews/:id/status` | Kiểm duyệt đánh giá | Admin |
| `POST` | `/api/reviews/:id/reply` | Chủ cơ sở phản hồi đánh giá | Vendor |

---

## ❤️ Module 8: Yêu thích (Wishlist)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `GET` | `/api/wishlist` | Xem danh sách yêu thích của mình | User |
| `POST` | `/api/wishlist` | Thêm Property vào yêu thích | User |
| `DELETE` | `/api/wishlist/:propertyId` | Xóa khỏi yêu thích | User |

---

## 🔧 Module 9: Tiện ích (Amenity) — Dữ liệu hệ thống
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|--------|-------|
| `GET` | `/api/amenities` | Lấy danh sách tất cả tiện ích | Public |
| `POST` | `/api/amenities` | Tạo tiện ích mới | Admin |

---

**Tổng kết ưu tiên thực hiện:**
1. **Ưu tiên cao:** Module Property, Room/Ticket, Booking (đây là lõi của hệ thống).
2. **Ưu tiên trung bình:** Review, Wishlist, Location.
3. **Ưu tiên thấp (dữ liệu hệ thống):** Amenity, Admin Users.

Bạn muốn tôi bắt đầu code từ Module nào trước?