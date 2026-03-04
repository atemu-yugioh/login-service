# Login

## Overview

Đăng nhập vào hệ thống với email và password. Trả về JWT tokens và thông tin user.

## Endpoint

```
POST /api/v1/auth/login
```

## Headers

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| x-api-key | `<API_KEY>` |
| x-device-id | `<DEVICE_ID>` |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email đã đăng ký |
| `password` | string | Yes | Mật khẩu |

### Example Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Response

### Success (200 OK) - Without 2FA
```json
{
  "message": "Login success",
  "status": 200,
  "data": {
    "token": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "session": {
        "id": "507f1f77bcf86cd799439011",
        "isValid": true
      }
    },
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "phone": "0912345678",
      "is2FAEnabled": false,
      "avatar": "",
      "address": "",
      "birthday": ""
    }
  },
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Success (200 OK) - With 2FA Enabled
```json
{
  "message": "Login success",
  "status": 200,
  "data": {
    "token": {
      "accessToken": null,
      "refreshToken": null,
      "session": {
        "id": "507f1f77bcf86cd799439011",
        "isValid": false
      }
    },
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "is2FAEnabled": true
    }
  },
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (400 - Invalid Credentials)
```json
{
  "message": "Error:: email not registered",
  "status": 400,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (400 - Wrong Password)
```json
{
  "message": "Error:: password invalid!!",
  "status": 400,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Validation Rules

| Field | Rules |
|-------|-------|
| `email` | - Required<br>- Valid email<br>- Domain: .com hoặc .net |
| `password` | - Required<br>- String<br>- Min 6 characters<br>- Max 16 characters |

## Business Logic

1. **Kiểm tra user tồn tại**: Tìm user theo email
2. **So sánh mật khẩu**: Sử dụng bcrypt để so sánh password
3. **Kiểm tra 2FA**:
   - Nếu user bật 2FA → session tạm thời invalid, cần verify OTP
   - Nếu user chưa bật 2FA → trả về token bình thường
4. **Tạo tokens**: Sinh accessToken và refreshToken
5. **Tạo session**: Lưu session vào database

## 2FA Flow

```
1. User login với email/password đúng
2. Nếu is2FAEnabled = true:
   - accessToken = null
   - refreshToken = null
   - session.isValid = false
   - User cần gọi /auth/verify-otp-2fa để xác thực
3. Nếu is2FAEnabled = false:
   - Trả về đầy đủ tokens
   - session.isValid = true
```

## Notes

- Khi 2FA enabled, tokens sẽ là `null` cho đến khi verify OTP
- Session sẽ bị vô hiệu sau 5 phút nếu không verify 2FA
