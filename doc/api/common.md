# Common API Documentation

## Base URL
```
http://localhost:9999/api/v1
```

## Required Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Content-Type` | string | Yes | `application/json` |
| `x-api-key` | string | Yes | API key từ `/api-key` endpoint |
| `x-device-id` | string | Yes | Device identifier (UUID) |
| `Authorization` | string | Conditional | Bearer token (JWT) cho protected routes |
| `x-client-id` | string | Conditional | Session ID (khi verify 2FA) |
| `Accept-Language` | string | No | `en` hoặc `vn` |

---

## Success Response Format

```json
{
  "message": "Success message",
  "status": 200,
  "data": {
    // Response data here
  },
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Response Format

```json
{
  "message": "Error message",
  "status": 400,
  "data": null,
  "errors": [
    {
      "message": "Field error message",
      "field": "fieldName"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request thành công |
| 201 | Created - Resource được tạo thành công |
| 400 | Bad Request - Request không hợp lệ |
| 401 | Unauthorized - Thiếu hoặc token không hợp lệ |
| 403 | Forbidden - Không có quyền truy cập |
| 404 | Not Found - Resource không tồn tại |
| 500 | Internal Server Error - Lỗi server |

---

## Validation Error Messages

### Email
| Error | Message |
|-------|---------|
| Required | `Email is required` |
| Invalid | `Email must be a valid email` |
| Invalid domain | `Email domain must be .com or .net` |

### Password
| Error | Message |
|-------|---------|
| Required | `Password is required` |
| Type | `Password must be a string` |
| Min/Max | `Password must be between 6 and 16 characters` |

### Name
| Error | Message |
|-------|---------|
| Required | `Name is required` |
| Type | `Name must be a string` |
| Size | `Name must be between 5 and 50 characters` |

### Phone
| Error | Message |
|-------|---------|
| Required | `Phone is required` |
| Type | `Phone must be a string` |
| Pattern | `Phone must be 10-12 digits` |

---

## Rate Limiting

- **Limit**: 30 requests per 15 seconds
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Authentication Flow

```
1. Register/Login → Nhận accessToken & refreshToken
2. Gọi API protected → Thêm Authorization: Bearer <accessToken>
3. Token hết hạn → Gọi /auth/handle-refresh-token với refreshToken
4. Logout → Vô hiệu hóa session
```
