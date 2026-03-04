# Get API Key Detail

## Overview

Lấy thông tin chi tiết của API key hiện tại.

## Endpoint

```
GET /api/v1/api-key
```

## Headers

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| x-api-key | `<API_KEY>` |
| x-device-id | `<DEVICE_ID>` |

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
  "message": "ApiKey detail",
  "status": 200,
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

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | API key (đã được mask một phần) |
| `name` | string | Tên của API key |
| `permissions` | array | Danh sách permissions |
| `version` | number | Version của key |
| `isDisable` | boolean | Trạng thái vô hiệu hóa |
| `createdDate` | date | Ngày tạo |

## Notes

- API chỉ trả về thông tin metadata của key, không trả về key đầy đủ vì lý do bảo mật
- Cần sử dụng x-api-key header để xác định key nào đang được query
