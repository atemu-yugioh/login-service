## Đổi mật khẩu (Change Password)

- **Method**: `PATCH`
- **URL**: `/api/v1/auth/change-password`
- **Mô tả**: Đổi mật khẩu cho user hiện tại, đồng thời hủy toàn bộ session cũ và tạo session/token mới.

### Headers

- `x-api-key` (bắt buộc).
- `x-device-id` (bắt buộc).
- `x-client-id` (bắt buộc).
- `authorization` **hoặc** `x-rtoken-id` (bắt buộc): token đang dùng.
- `accept-language` (tùy chọn).

### Request body

```json
{
  "password": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

Ràng buộc (theo `userChangePasswordSchema`):

- `password`: password hiện tại, theo rule chung (min 6, max 16).
- `newPassword`: password mới, theo rule chung.
- `confirmPassword`: phải trùng với `newPassword`.

### Luồng xử lý chính

1. Middleware `authentication`:
   - Verify token, gán `req.user` (gồm `userId`, `email`, `deviceId`).
2. Service `AuthService.changePassword`:
   - Check đủ field `password`, `newPassword`, `confirmPassword`.
   - Tìm user theo email, nếu không tồn tại → lỗi.
   - So sánh password cũ.
   - Hash `newPassword`.
   - Xóa tất cả session cũ của user (`sessionRepo.deleteByUserId`).
   - Tạo public/private key mới, sinh cặp token mới.
   - Tạo session mới với refresh token mới.
   - Cập nhật mật khẩu trong DB.

### Response thành công

```json
{
  "status": 200,
  "message": "Success",
  "timestamp": 1700000000000,
  "data": {
    "token": {
      "accessToken": "<new_access_token>",
      "refreshToken": "<new_refresh_token>"
    },
    "user": {
      "_id": "<user_id>",
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

### Response lỗi (ví dụ)

- Thiếu field:

```json
{
  "status": 400,
  "message": "Error:: miss field"
}
```

- User không tồn tại:

```json
{
  "status": 400,
  "message": "Error:: user not registered!!"
}
```

- Mật khẩu cũ sai:

```json
{
  "status": 400,
  "message": "Error: password wrong"
}
```

