## Mục tiêu hệ thống

`login-service` cung cấp các API cho:

- **Đăng ký / đăng nhập người dùng** với mật khẩu.
- **Quản lý phiên đăng nhập (session)**.
- **Xác thực hai yếu tố (2FA)** qua OTP (email/SMS, QR, otplib).
- **Quản lý API key và phân quyền** (permission) cho client/app.
- **Gửi email và SMS** phục vụ xác thực, thông báo (SMTP, Ethereal, Sendgrid, Twilio).

## Đối tượng sử dụng

- **Ứng dụng web/mobile** cần dịch vụ đăng nhập tập trung.
- **Các service nội bộ khác** trong hệ thống cần xác thực qua API key.

## Functional requirements (chức năng)

- **User**
  - Đăng ký tài khoản mới.
  - Đăng nhập với email/username + password.
  - Bật/tắt 2FA.
  - Nhận OTP qua email/SMS (tùy cấu hình).
  - Lấy thông tin user hiện tại.

- **Auth / Session**
  - Tạo phiên đăng nhập khi login thành công.
  - Hủy phiên (logout).
  - Kiểm tra trạng thái phiên khi gọi các API protected.
  - Hết hạn session theo thời gian/logic cấu hình (Redis/Mongo).

- **API Key**
  - Tạo API key cho client/app.
  - Gắn quyền (permission) cho API key (ví dụ: `auth`, `user`, `admin`…).
  - Kiểm tra API key với middleware `requiredApiKey`.
  - Kiểm tra thiết bị (`requiredDevice`) và permission (`requiredPermission`).

- **Email/SMS/2FA**
  - Gửi email xác thực/OTP qua:
    - SMTP (`smtp.mail.helper`).
    - Ethereal (dùng test).
    - Sendgrid.
  - Gửi SMS OTP qua Twilio.
  - Tạo/verify OTP, QR code 2FA (`src/helpers/2FA/2fa.helper.js` + `otplib`, `qrcode`).

## Non-functional requirements (phi chức năng)

- **Bảo mật**
  - Sử dụng `helmet` để thêm security header.
  - Hash mật khẩu với `bcrypt`.
  - Token/secret không được hard-code, phải dùng biến môi trường (`.env`).
  - Rate limiting để bảo vệ khỏi brute-force (`rateLimiter.middleware`).

- **Hiệu năng**
  - Dùng `compression` để giảm dung lượng response.
  - Sử dụng Redis cho các operation cần tốc độ cao / event-driven.

- **Khả năng mở rộng**
  - Stateless ở mức HTTP, có thể scale ngang nhiều instance kết nối cùng Mongo + Redis.
  - Module hóa theo feature (auth, user, apiKey) để dễ mở rộng thêm module khác.

- **Quan sát / Logging**
  - Dùng `morgan` log HTTP request.
  - Có thể cấu hình thêm logger nâng cao sau này (winston, pino…).

## Mô hình dữ liệu (ở mức high-level)

- **User**
  - Trường cơ bản: email, password (hash), trạng thái, thông tin profile.
  - Trường bảo mật: flag `is2FAEnabled`, secret cho 2FA nếu có.

- **Session**
  - Tham chiếu đến user.
  - Thông tin device, IP, thời gian tạo, thời gian hết hạn.

- **ApiKey**
  - Giá trị key.
  - Quyền (permissions).
  - Thông tin client/ứng dụng.

> Chi tiết schema nằm ở `src/models/*.model.js` và repository trong `src/models/repositories/*.repositories.js`.

## Quy ước lỗi và response

- **Thành công**: dùng chuẩn `success.response`:
  - Gồm: `message`, `status`, `timestamp`, `data`.
- **Lỗi**:
  - Dùng `error.response` và error handler trong `src/app.js`.
  - Message được dịch qua i18n (`req.t`).
  - Nếu có `errors` (mảng chi tiết), mỗi item sẽ có trường `message` đã dịch.

