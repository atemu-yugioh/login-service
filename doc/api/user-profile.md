## Lấy thông tin user (User Profile)

- **Method**: `GET`
- **URL**: `/api/v1/user/profile/:id`
- **Mô tả**: Lấy thông tin chi tiết của user theo `id`.

### Headers

- `x-api-key` (bắt buộc).
- `x-device-id` (bắt buộc).
- `x-client-id` (bắt buộc).
- `authorization` **hoặc** `x-rtoken-id` (bắt buộc).
- `accept-language` (tùy chọn).

> Router `user` áp dụng middleware `authentication` cho mọi endpoint, nên bắt buộc phải có đủ header auth như trên.

### Path params

- `id`: MongoDB ObjectId của user cần lấy thông tin.

### Request body

- Không yêu cầu body.

### Response thành công

```json
{
  "status": 200,
  "message": "user detail",
  "timestamp": 1700000000000,
  "data": {
    "user": {
      "name": "User Name",
      "email": "user@example.com",
      "phone": "0123456789",
      "address": null,
      "birthDay": null,
      "avatar": null,
      "is2FAEnabled": false
    }
  }
}
```

- Trường `user` chỉ chứa các field được chọn trong `UserService`:
  - `name`, `email`, `phone`, `address`, `birthDay`, `avatar`, `is2FAEnabled`.

### Response lỗi

- Nếu `id` không tồn tại hoặc không phải user hợp lệ, service có thể trả về `user: null` hoặc error (tùy repository). Khi tích hợp thực tế, nên kiểm tra `data.user` có null hay không.

