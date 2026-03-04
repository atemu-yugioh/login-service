# Enable 2FA

## Overview

Bật tính năng Two-Factor Authentication (2FA) cho tài khoản. Trả về QR code để user quét bằng ứng dụng authenticator.

## Endpoint

```
POST /api/v1/auth/enable-2fa
```

## Headers

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| x-api-key | `<API_KEY>` |
| x-device-id | `<DEVICE_ID>` |
| Authorization | Bearer `<ACCESS_TOKEN>` |

## Request Body

Không cần request body.

### Example Request
```json
{}
```

## Response

### Success (200 OK)
```json
{
  "message": "Success",
  "status": 200,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEU..."
  },
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (400 - 2FA Already Enabled)
```json
{
  "message": "2fa is enabling",
  "status": 400,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (404 - User Not Found)
```json
{
  "message": "user not exist!!",
  "status": 404,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Authentication

Bắt buộc phải có JWT accessToken trong header:
```
Authorization: Bearer <accessToken>
```

## Business Logic

1. **Kiểm tra user tồn tại**: Tìm user theo ID từ token
2. **Kiểm tra 2FA đã bật chưa**: Nếu đã bật, trả về lỗi
3. **Tạo secret key**: Sinh TOTP secret key
4. **Tạo QR code**: Sinh QR code chứa thông tin authenticator
5. **Lưu secret vào database**: Lưu secretKeyOTP vào user document
6. **Cập nhật trạng thái 2FA**: Set is2FAEnabled = true

## QR Code Format

QR code chứa URL theo format:
```
otpauth://totp/loginService:<user_email>?secret=<SECRET_KEY>&issuer=loginService
```

## Setup 2FA App

1. Tải ứng dụng authenticator (Google Authenticator, Authy, Microsoft Authenticator,...)
2. Quét QR code từ response
3. Nhập mã OTP hiển thị trên app để xác nhận

## Notes

- User cần quét QR code bằng ứng dụng authenticator trước khi có thể sử dụng 2FA
- Secret key được lưu trong database để verify OTP sau này
- Sau khi bật 2FA, lần đăng nhập tiếp theo sẽ yêu cầu nhập OTP
