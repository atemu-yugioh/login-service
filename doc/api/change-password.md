# Change Password

## Overview

Đổi mật khẩu của user hiện tại. Yêu cầu xác thực JWT.

## Endpoint

```
PATCH /api/v1/auth/change-password
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
| `password` | string | Yes | Mật khẩu hiện tại |
| `newPassword` | string | Yes | Mật khẩu mới (6-16 ký tự) |
| `confirmPassword` | string | Yes | Xác nhận mật khẩu mới (phải giống newPassword) |

### Example Request
```json
{
  "password": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

## Response

### Success (200 OK)
```json
{
  "message": "Success",
  "status": 200,
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

### Error (400 - Wrong Current Password)
```json
{
  "message": "Error: password wrong",
  "status": 400,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (400 - Password Mismatch)
```json
{
  "message": "Validation error",
  "status": 400,
  "data": null,
  "errors": [
    {
      "message": "confirmPassword must be one of [ref:newPassword]",
      "field": "confirmPassword"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (400 - Missing Fields)
```json
{
  "message": "Error:: miss field",
  "status": 400,
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
| `password` | - Required<br>- String<br>- Min 6 characters<br>- Max 16 characters |
| `newPassword` | - Required<br>- String<br>- Min 6 characters<br>- Max 16 characters |
| `confirmPassword` | - Required<br>- Phải giống `newPassword` |

## Business Logic

1. **Xác thực user**: Lấy từ JWT token
2. **Kiểm tra password cũ**: So sánh với password trong database
3. **Hash mật khẩu mới**: Sử dụng bcrypt
4. **Xóa tất cả sessions**: User sẽ phải đăng nhập lại trên tất cả thiết bị
5. **Tạo tokens mới**: Sinh cặp token mới cho session hiện tại
6. **Cập nhật password**: Lưu password mới vào database

## Security Notes

- Sau khi đổi password, tất cả sessions cũ sẽ bị xóa (force logout trên tất cả thiết bị)
- User sẽ nhận được token mới cho thiết bị hiện tại
- User cần đăng nhập lại trên các thiết bị khác
