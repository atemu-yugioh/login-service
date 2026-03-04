## Đăng nhập (Login)

- **Method**: `POST`
- **URL**: `/api/v1/auth/login`
- **Mô tả**: Đăng nhập với email và password, tạo session mới, trả về cặp token (access + refresh). Nếu user bật 2FA thì session ban đầu sẽ bị đánh dấu invalid cho tới khi verify OTP.

### Headers

- `x-api-key` (bắt buộc): API key hợp lệ.
- `x-device-id` (bắt buộc): ID thiết bị đang đăng nhập (chuỗi bất kỳ nhưng nên ổn định cho mỗi device).
- `accept-language` (tùy chọn): `en`, `vn`,… để i18n message.

### Request body

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Ràng buộc (theo `userLoginSchema`):

- `email`: email hợp lệ, domain `.com` hoặc `.net`.
- `password`: string, min 6, max 16.

### Response thành công (is2FAEnabled = false)

```json
{
  "status": 200,
  "message": "login_success",
  "timestamp": 1700000000000,
  "data": {
    "token": {
      "accessToken": "<jwt_access_token>",
      "refreshToken": "<jwt_refresh_token>",
      "session": {
        "id": "<session_id>",
        "isValid": true
      }
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

> Trường `user` chỉ chứa các field trong `selectFields` của `AuthService`: `_id`, `name`, `email`, `phone`, `address`, `birthDay`, `avatar`, `is2FAEnabled`.

### Response thành công (is2FAEnabled = true)

Khi user đã bật 2FA:

- Session mới được tạo nhưng được đánh dấu invalid trong Redis (`sessionInvalid:<sessionId>`).
- Client phải gọi thêm endpoint `verify-otp-2fa` để hoàn tất.

Response tương tự nhưng:

```json
{
  "data": {
    "token": {
      "accessToken": "<jwt_access_token>",
      "refreshToken": "<jwt_refresh_token>",
      "session": {
        "id": "<session_id>",
        "isValid": false
      }
    },
    "user": {
      "...": "..."
    }
  }
}
```

### Response lỗi (ví dụ)

- Email chưa đăng ký:

```json
{
  "status": 400,
  "message": "Error:: email not registered",
  "timestamp": 1700000000000,
  "data": null
}
```

- Sai mật khẩu:

```json
{
  "status": 400,
  "message": "Error:: password invalid!!",
  "timestamp": 1700000000000,
  "data": null
}
```

### Ghi chú luồng 2FA

1. User login thành công, nhưng `is2FAEnabled = true` → nhận token và `session.isValid = false`.
2. Client yêu cầu user nhập OTP (từ app authenticator).
3. Client gọi `/api/v1/auth/verify-otp-2fa` với `sessionId` và `otp`.
4. Nếu OTP đúng, Redis xóa key `sessionInvalid:<sessionId>` → session hợp lệ, các request sau dùng accessToken/refreshToken bình thường.

