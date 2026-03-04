# Get User Profile

## Overview

Lấy thông tin chi tiết của user theo ID. Yêu cầu xác thực JWT.

## Endpoint

```
GET /api/v1/user/profile/:id
```

## Headers

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| x-api-key | `<API_KEY>` |
| x-device-id | `<DEVICE_ID>` |
| Authorization | Bearer `<ACCESS_TOKEN>` |

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB ObjectId của user |

### Example Request
```
GET /api/v1/user/profile/507f1f77bcf86cd799439011
```

## Response

### Success (200 OK)
```json
{
  "message": "user detail",
  "status": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "phone": "0912345678",
    "avatar": "",
    "address": "",
    "birthday": "",
    "is2FAEnabled": false
  },
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (404 - User Not Found)
```json
{
  "message": "User not found",
  "status": 404,
  "data": null,
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (401 - Unauthorized)
```json
{
  "message": "Unauthorized",
  "status": 401,
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

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | MongoDB ObjectId |
| `name` | string | Tên user |
| `email` | string | Email user |
| `phone` | string | Số điện thoại |
| `avatar` | string | URL avatar |
| `address` | string | Địa chỉ |
| `birthday` | string | Ngày sinh |
| `is2FAEnabled` | boolean | Trạng thái 2FA |

## Notes

- User cần đăng nhập để gọi API này
- API trả về thông tin public của user (không trả về password, secret key)
