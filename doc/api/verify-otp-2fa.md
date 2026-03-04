## Xác thực OTP 2FA (Verify OTP 2FA)

- **Method**: `POST`
- **URL**: `/api/v1/auth/verify-otp-2fa`
- **Mô tả**: Xác thực OTP cho session đang chờ 2FA, nếu đúng sẽ kích hoạt session (xóa trạng thái invalid trong Redis).

### Headers

- `x-api-key` (bắt buộc).
- `x-device-id` (bắt buộc) – dùng thống nhất cho mọi request.
- `x-client-id` (bắt buộc): userId của user đang verify.
- `accept-language` (tùy chọn).

> Endpoint này **không** đi qua `authentication` nên không cần access/refresh token, nhưng sẽ:
> - Lấy userId từ `x-client-id`.

### Request body

```json
{
  "otp": "123456",
  "sessionId": "<session_id>"
}
```

- `otp`: mã OTP sinh từ app authenticator.
- `sessionId`: id của session được trả về sau khi login (khi `is2FAEnabled = true`).

### Luồng xử lý chính (AuthService.verify2FA)

- Tìm user theo `id`.
- Verify OTP:
  - `verifyOTPToken(otp, userFound.secretKeyOTP)`.
- Nếu hợp lệ:
  - Xóa key Redis `sessionInvalid:<sessionId>` → session được xem là valid.

### Response thành công

```json
{
  "status": 200,
  "message": "Success",
  "timestamp": 1700000000000,
  "data": {
    "isValid": true
  }
}
```

### Response lỗi (ví dụ)

- User không tồn tại:

```json
{
  "status": 400,
  "message": "user not exist!!"
}
```

- OTP sai:

```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "isValid": false
  }
}
```

> Trường hợp OTP sai, service chỉ trả `isValid: false` chứ không ném lỗi, nên HTTP status vẫn 200.

