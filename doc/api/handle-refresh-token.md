## Làm mới token (Handle Refresh Token)

- **Method**: `POST`
- **URL**: `/api/v1/auth/handle-refresh-token`
- **Mô tả**: Dùng refresh token hợp lệ để lấy cặp token mới (access + refresh), đồng thời cập nhật session.

### Headers

- `x-api-key` (bắt buộc).
- `x-device-id` (bắt buộc).
- `x-client-id` (bắt buộc).
- `x-rtoken-id` (bắt buộc): refresh token hiện tại.
- `accept-language` (tùy chọn).

> Endpoint này đi qua middleware `authentication`. Middleware sẽ:
> - Lấy session hiện tại dựa trên `x-client-id` + `x-device-id`.
> - Verify refresh token bằng `session.privateKey`.
> - Gán `req.user`, `req.session`, `req.refreshToken`.

### Request body

- Không yêu cầu body (mọi thông tin lấy từ headers + req nội bộ).

### Luồng xử lý chính (AuthService.handleRefreshToken)

- Kiểm tra user tồn tại theo email trong token.
- Kiểm tra:
  - Refresh token có nằm trong `session.refreshTokenUsed` không:
    - Nếu **có**: coi như refresh token bị lộ → xóa tất cả session của user, yêu cầu login lại.
  - Refresh token có trùng với `session.refreshToken` đang lưu trong DB không:
    - Nếu **không**: ném lỗi `AuthFailError('RefreshToken invalid,pls re-login')`.
- Sinh cặp token mới (access + refresh) với public/private key hiện tại.
- Lưu refresh token cũ vào `refreshTokenUsed`, cập nhật refresh token mới.

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

- Refresh token không trùng với trong DB:

```json
{
  "status": 401,
  "message": "RefreshToken invalid,pls re-login",
  "timestamp": 1700000000000
}
```

- Refresh token đã từng sử dụng (replay):

```json
{
  "status": 401,
  "message": "Something went wrong, pls login",
  "timestamp": 1700000000000
}
```

