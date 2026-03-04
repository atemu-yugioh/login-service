## Tổng quan API

Tất cả endpoint được mount dưới prefix:

- **Base URL**: `/api/v1`

Router gốc: `src/routes/index.js`:

- Áp dụng:
  - `rateLimiter(30, 1500)`
  - `requiredApiKey`
  - `requiredDevice`
- Routing:
  - `/api/v1/api-key` → module API key.
  - `/api/v1/auth` → module auth (yêu cầu `requiredPermission('auth')`).
  - `/api/v1/user` → module user.

> Lưu ý: Chi tiết chính xác từng path nằm trong `src/routes/auth/index.js`, `src/routes/user/index.js`, `src/routes/apiKey/index.js`. File này mô tả mức high-level để onboard nhanh.

## Nhóm API Key

Prefix: `/api/v1/api-key`

Chức năng điển hình:

- Tạo API key cho client/app.
- List/ẩn/khóa API key.
- Gán permission cho API key (ví dụ: `auth`, `user`, `admin`…).

Middleware:

- Luôn đi qua `requiredApiKey`, `requiredDevice`, có thể có thêm permission tùy từng route con.

### Tài liệu chi tiết endpoint

- **Tạo API Key**: `POST /api/v1/api-key` – xem `doc/api/api-key-create.md`
- **Chi tiết API Key**: `GET /api/v1/api-key` – xem `doc/api/api-key-detail.md`

## Nhóm Auth

Prefix: `/api/v1/auth`

Chức năng chính:

- Đăng ký tài khoản.
- Đăng nhập (login) bằng email + password.
- Bật/tắt 2FA, generate secret/QR, verify OTP.
- Refresh token / renew session (nếu được triển khai).
- Logout, revoke session.

Trong router gốc, `/auth` được bảo vệ bởi:

- `requiredPermission('auth')`: kiểm tra API key hiện tại có quyền truy cập nhóm auth hay không.

### Tài liệu chi tiết một số endpoint quan trọng

- **Đăng ký (Register)**: xem `doc/api/register.md`
- **Đăng nhập (Login)**: xem `doc/api/login.md`
- **Đăng xuất (Logout)**: xem `doc/api/logout.md`
- **Làm mới token (Handle Refresh Token)**: xem `doc/api/handle-refresh-token.md`
- **Đổi mật khẩu (Change Password)**: xem `doc/api/change-password.md`
- **Bật 2FA (Enable 2FA)**: xem `doc/api/enable-2fa.md`
- **Tắt 2FA (Disable 2FA)**: xem `doc/api/disable-2fa.md`
- **Xác thực OTP 2FA (Verify OTP 2FA)**: xem `doc/api/verify-otp-2fa.md`

## Nhóm User

Prefix: `/api/v1/user`

Chức năng chính:

- Lấy thông tin user hiện tại (me).
- Cập nhật profile cơ bản.
- Quản lý danh sách session của user (nếu có).

### Tài liệu chi tiết endpoint

- **Lấy thông tin user**: `GET /api/v1/user/profile/:id` – xem `doc/api/user-profile.md`

## Chuẩn request / response

- **Header chung** (gợi ý, tùy implement thực tế):
  - `x-api-key`: API key.
  - `x-device-id` hoặc header device tương đương để `requiredDevice` kiểm tra.
  - `accept-language`: ngôn ngữ dùng cho i18n (ví dụ: `en`, `vn`).

- **Body**:
  - Dùng `application/json`.
  - Được validate bằng Joi trong `src/helpers/validations/input/...`.

- **Response thành công**:
  - `status`: HTTP status code (200, 201,…).
  - `message`: message có thể dịch qua i18n.
  - `timestamp`: thời điểm server xử lý.
  - `data`: payload chính.

- **Response lỗi**:
  - `status`: HTTP status code (4xx, 5xx).
  - `message`: message lỗi (qua i18n).
  - `errors`: (tuỳ chọn) danh sách lỗi chi tiết (validation, business…).

## Versioning

- Hiện tại API dùng prefix `/api/v1`.
- Khi có breaking change, nên tạo route mới `/api/v2` và giữ `/api/v1` cho backward compatibility.

