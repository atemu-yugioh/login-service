## Tắt 2FA (Disable 2FA)

- **Method**: `POST`
- **URL**: `/api/v1/auth/disable-2fa`
- **Mô tả**: Tắt xác thực hai yếu tố cho user hiện tại.

### Headers

- `x-api-key` (bắt buộc).
- `x-device-id` (bắt buộc).
- `x-client-id` (bắt buộc).
- `authorization` **hoặc** `x-rtoken-id` (bắt buộc).
- `accept-language` (tùy chọn).

### Request body

- Không yêu cầu body.

### Luồng xử lý chính (AuthService.disable2FA)

- Tìm user theo `id`.
- Nếu user không tồn tại → lỗi “user not exist!!”.
- Gọi `enable2FA(id, false, userFound.secretKeyOTP)` để cập nhật flag `is2FAEnabled = false`.

### Response thành công

```json
{
  "status": 200,
  "message": "Success",
  "timestamp": 1700000000000,
  "data": {
    "acknowledged": true
  }
}
```

(Cấu trúc `data` phụ thuộc vào repository, ví dụ có thể là document hoặc result của update).

### Response lỗi

- User không tồn tại:

```json
{
  "status": 400,
  "message": "user not exist!!"
}
```

