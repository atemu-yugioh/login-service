# Logout

## Overview

Đăng xuất khỏi hệ thống và vô hiệu hóa session hiện tại.

## Endpoint

```
POST /api/v1/auth/logout
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
    "deleted": true
  },
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

## Business Logic

1. **Xác thực token**: Kiểm tra token từ header
2. **Lấy thông tin session**: Từ token, lấy sessionId
3. **Xóa session**: Xóa session khỏi database
4. **Vô hiệu hóa token**: Token sẽ không còn valid

## Notes

- Sau khi logout, accessToken và refreshToken cũ sẽ không còn sử dụng được
- User cần đăng nhập lại để tiếp tục sử dụng
