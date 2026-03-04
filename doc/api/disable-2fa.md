# Disable 2FA

## Overview

Tắt tính năng Two-Factor Authentication (2FA) cho tài khoản.

## Endpoint

```
POST /api/v1/auth/disable-2fa
```

## Headers

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| x-api-key | `<API_KEY>` |
| x-device-id | `<DEVICE_ID>` |
| Authorization | Bearer `<ACCESS_TOKEN>` |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `otpCode` | string | Yes | Mã OTP từ ứng dụng authenticator |

### Example Request
```json
{
  "otpCode": "123456"
}
```

## Response

### Success (200 OK)
```json
{
  "message": "Success",
  "status": 200,
  "data": {
    "is2FAEnabled": false
  },
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

## Validation Rules

| Field | Rules |
|-------|-------|
| `otpCode` | - Required<br>- String<br>- 6 chữ số |

## Business Logic

1. **Kiểm tra user tồn tại**: Tìm user theo ID từ token
2. **Xóa secret key**: Xóa secretKeyOTP khỏi user document
3. **Cập nhật trạng thái**: Set is2FAEnabled = false

## Notes

- Không cần OTP để tắt 2FA (chỉ cần đăng nhập)
- Secret key TOTP sẽ bị xóa khỏi database
- Sau khi tắt 2FA, user đăng nhập không cần nhập OTP nữa
