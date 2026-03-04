# Create API Key

## Overview

Tạo API key mới để sử dụng cho các request tới hệ thống.

## Endpoint

```
POST /api/v1/api-key
```

## Headers

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| x-api-key | `<EXISTING_API_KEY>` |
| x-device-id | `<DEVICE_ID>` |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Tên của API key |
| `permissions` | array | Yes | Danh sách permissions |

### Example Request
```json
{
  "name": "My API Key",
  "permissions": ["auth", "user"]
}
```

## Response

### Success (201 Created)
```json
{
  "message": "Create apiKey successs",
  "status": 201,
  "data": {
    "key": "sk_abc123xyz789def456...",
    "name": "My API Key",
    "permissions": ["auth", "user"],
    "version": 1,
    "isDisable": false,
    "createdDate": "2024-01-01T00:00:00.000Z"
  },
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Validation Rules

| Field | Rules |
|-------|-------|
| `name` | - Required<br>- String |
| `permissions` | - Required<br>- Array of strings<br>- Các giá trị hợp lệ: `auth`, `user` |

## Available Permissions

| Permission | Description |
|------------|-------------|
| `auth` | Truy cập authentication endpoints |
| `user` | Truy cập user endpoints |

## Business Logic

1. **Kiểm tra API key hiện tại**: Validate x-api-key header
2. **Tạo key mới**: Sinh random key với prefix `sk_`
3. **Gán permissions**: Lưu permissions vào database
4. **Trả về key**: **Lưu ý**: Key chỉ hiển thị **MỘT LẦN DUY NHẤT** khi tạo

## Notes

- **QUAN TRỌNG**: API key chỉ được hiển thị một lần khi tạo
- User phải lưu lại key sau khi tạo
- Key bắt đầu với prefix `sk_`
