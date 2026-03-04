## Đăng ký (Register)

- **Method**: `POST`
- **URL**: `/api/v1/auth/register`
- **Mô tả**: Đăng ký user mới, tạo luôn session và sinh cặp token (access + refresh).

### Headers

- `x-api-key` (bắt buộc): API key hợp lệ.
- `x-device-id` (bắt buộc): ID thiết bị dùng để đăng ký (sẽ gắn vào session).
- `accept-language` (tùy chọn): `en`, `vn`,… để i18n message.

### Request body

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "123456",
  "phone": "0123456789"
}
```

Ràng buộc (theo `userRegisterSchema`):

- `name`: string, min 5, max 50, required.
- `email`: email hợp lệ, domain `.com` hoặc `.net`, required.
- `password`: string, min 6, max 16, required.
- `phone`: chuỗi 10–12 chữ số (`/^\d{10,12}$/`), required.

### Response thành công

```json
{
  "status": 201,
  "message": "register_success",
  "timestamp": 1700000000000,
  "data": {
    "token": {
      "accessToken": "<jwt_access_token>",
      "refreshToken": "<jwt_refresh_token>"
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

- Sau khi đăng ký:
  - Mật khẩu được hash bằng `bcrypt`.
  - User mới được tạo trong MongoDB.
  - Sinh `publicKey` và `privateKey` cho session.
  - Sinh `accessToken` + `refreshToken` bằng `createPairToken`.
  - Tạo session mới trong collection `session`.

### Response lỗi (ví dụ)

- Email đã tồn tại:

```json
{
  "status": 400,
  "message": "Email already registered!!",
  "timestamp": 1700000000000,
  "data": null
}
```

- Lỗi validate input (ví dụ name quá ngắn, sai pattern phone…):

```json
{
  "status": 422,
  "message": "Validation error",
  "timestamp": 1700000000000,
  "data": null,
  "errors": [
    {
      "field": "name",
      "message": "name_size"
    }
  ]
}
```

> Thực tế message lỗi phụ thuộc file `locales` và cách validator map lỗi, nhưng cấu trúc chung sẽ có `errors` là mảng chi tiết.

