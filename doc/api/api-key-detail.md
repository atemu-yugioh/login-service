## Lấy thông tin API Key (Get API Key Detail)

- **Method**: `GET`
- **URL**: `/api/v1/api-key`
- **Mô tả**: Lấy thông tin chi tiết của API key hiện đang gửi lên.

### Headers

- `x-api-key` (bắt buộc): API key cần tra cứu.
- `accept-language` (tùy chọn).

### Request body

- Không yêu cầu body.

### Response thành công

```json
{
  "status": 200,
  "message": "ApiKey detail",
  "timestamp": 1700000000000,
  "data": {
    "_id": "<api_key_id>",
    "key": "random-api-key-value",
    "permissions": ["auth", "user"],
    "createdBy": "admin-id-or-email",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

- Các field nội bộ như `isDisable`, `isDelete`, `isDefault`, `__v` đã bị ẩn.

### Response lỗi

- API key không tồn tại:

```json
{
  "status": 403,
  "message": "Access denied. ApiKey not exist!!",
  "timestamp": 1700000000000
}
```

