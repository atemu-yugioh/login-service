# Register User

## Overview

Tạo tài khoản người dùng mới trong hệ thống.

## Endpoint

```
POST /api/v1/auth/register
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
| `name` | string | Yes | Tên người dùng (5-50 ký tự) |
| `email` | string | Yes | Email (định dạng email hợp lệ, domain .com hoặc .net) |
| `phone` | string | Yes | Số điện thoại (10-12 chữ số) |
| `password` | string | Yes | Mật khẩu (6-16 ký tự) |

### Example Request
```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0912345678",
  "password": "password123"
}
```

## Response

### Success (201 Created)
```json
{
  "message": "Register success",
  "status": 201,
  "data": {
    "token": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
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

### Error (400 - Validation Error)
```json
{
  "message": "Validation error",
  "status": 400,
  "data": null,
  "errors": [
    {
      "message": "Name must be between 5 and 50 characters",
      "field": "name"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (400 - Email Exists)
```json
{
  "message": "Email already registered!!",
  "status": 400,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Validation Rules

| Field | Rules |
|-------|-------|
| `name` | - Required<br>- String<br>- Min 5 characters<br>- Max 50 characters |
| `email` | - Required<br>- Valid email<br>- Domain: .com hoặc .net<br>- Unique (không trùng lặp) |
| `phone` | - Required<br>- String<br>- 10-12 digits<br>- Không có ký tự đặc biệt |
| `password` | - Required<br>- String<br>- Min 6 characters<br>- Max 16 characters |

## Business Logic

1. **Kiểm tra email đã tồn tại**: Nếu email đã được đăng ký, trả về lỗi 400
2. **Mã hóa mật khẩu**: Sử dụng bcrypt để hash password
3. **Tạo user mới**: Lưu user vào MongoDB với các trường mặc định
4. **Tạo token**: Sinh cặp JWT (accessToken, refreshToken)
5. **Tạo session**: Lưu session vào database để track device

## Notes

- Sau khi đăng ký thành công, user sẽ có ngay accessToken và refreshToken
- User có thể đăng nhập ngay lập tức
- Mật khẩu được lưu dưới dạng bcrypt hash
