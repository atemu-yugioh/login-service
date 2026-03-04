## Bật 2FA (Enable 2FA)

- **Method**: `POST`
- **URL**: `/api/v1/auth/enable-2fa`
- **Mô tả**: Bật xác thực hai yếu tố cho user hiện tại, trả về QR code để add vào app authenticator.

### Headers

- `x-api-key` (bắt buộc).
- `x-device-id` (bắt buộc).
- `x-client-id` (bắt buộc).
- `authorization` **hoặc** `x-rtoken-id` (bắt buộc).
- `accept-language` (tùy chọn).

### Request body

- Không yêu cầu body.

### Luồng xử lý chính (AuthService.enable2FA)

- Tìm user theo `id` (từ `req.user.userId`).
- Nếu user không tồn tại → lỗi.
- Nếu 2FA đã bật (`is2FAEnabled = true`) → lỗi “2fa is enabling”.
- Nếu chưa có `secretKeyOTP`:
  - Sinh secret mới (`generateUniqueSecret`) và gán vào user.
- Sinh `otpauth://...` bằng `generateOTPToken`.
- Generate QR code image URL bằng `generateQRCode`.
- Cập nhật trạng thái 2FA của user (`enable2FA(userId, true, secretKeyOTP)`).

### Response thành công

```json
{
  "status": 200,
  "message": "Success",
  "timestamp": 1700000000000,
  "data": {
    "qrCode": "data:image/png;base64,...."
  }
}
```

Client hiển thị `qrCode` (image) để user quét bằng app như Google Authenticator, Authy…

### Response lỗi (ví dụ)

- User không tồn tại:

```json
{
  "status": 400,
  "message": "user not exist!!"
}
```

- 2FA đã bật:

```json
{
  "status": 400,
  "message": "2fa is enabling"
}
```

