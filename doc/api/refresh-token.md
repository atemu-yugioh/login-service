# Handle Refresh Token

## Overview

Làm mới access token và refresh token khi access token hết hạn.

## Endpoint

```
POST /api/v1/auth/handle-refresh-token
```

## Headers

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| x-api-key | `<API_KEY>` |
| x-device-id | `<DEVICE_ID>` |
| Authorization | Bearer `<REFRESH_TOKEN>` |

## Request Body

Không cần request body. Refresh token được lấy từ Authorization header.

### Example Request
```json
{}
```

## Response

### Success (200 OK)
```json
{
  "message": "Refresh token success",
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

### Error (401 - Refresh Token Invalid)
```json
{
  "message": "RefreshToken invalid,pls re-login",
  "status": 401,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (401 - Refresh Token Used)
```json
{
  "message": "Something went wrong, pls login",
  "status": 401,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Authentication

Sử dụng **refresh token** trong Authorization header:
```
Authorization: Bearer <refreshToken>
```

## Business Logic

1. **Xác thực refresh token**: Kiểm tra token có hợp lệ không
2. **Kiểm tra token đã được sử dụng**: Ngăn chặn replay attack
3. **Tạo token mới**: Sinh cặp accessToken và refreshToken mới
4. **Lưu refresh token cũ**: Thêm vào danh sách token đã sử dụng
5. **Trả về tokens mới**: Kèm thông tin user

## Token Expiration

| Token Type | Expiration |
|------------|------------|
| Access Token | 1 day |
| Refresh Token | 7 days |

## Notes

- Refresh token chỉ được sử dụng một lần
- Token cũ được lưu vào `refreshTokenUsed` array để ngăn chặn reuse
- Nếu phát hiện refresh token đã sử dụng, xóa tất cả sessions của user (bảo mật)
