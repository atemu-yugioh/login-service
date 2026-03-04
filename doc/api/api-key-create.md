## Tạo API Key (Create API Key)

- **Method**: `POST`
- **URL**: `/api/v1/api-key`
- **Mô tả**: Tạo mới một API key với danh sách permission.

### Headers

- `x-api-key`: không bắt buộc (endpoint này nằm trong router gốc, nhưng route `/api-key` bản thân không dùng `requiredApiKey` riêng). Tuy nhiên trong môi trường production, nên bảo vệ thêm bằng cơ chế riêng (admin).
- `accept-language` (tùy chọn).

### Request body

```json
{
  "key": "random-api-key-value",
  "permissions": ["auth", "user"],
  "createdBy": "admin-id-or-email"
}
```

- `key`: chuỗi dùng làm API key (nên unique).
- `permissions`: mảng permission, ví dụ: `["auth"]`, `["auth", "user"]`, `["admin"]`…
- `createdBy`: thông tin người/ứng dụng tạo key (tùy cách bạn sử dụng).

### Response thành công

```json
{
  "status": 201,
  "message": "Create apiKey successs",
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

- Một số field nội bộ như `isDisable`, `isDelete`, `isDefault`, `__v` đã được ẩn bởi `unGetInfoData`.

### Response lỗi

- Nếu `key` trùng hoặc lỗi DB, service sẽ ném error phù hợp (cụ thể message phụ thuộc repository/DB).

