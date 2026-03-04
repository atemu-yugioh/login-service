# Verify 2FA OTP

## Overview

Xác thực mã OTP sau khi đăng nhập với tài khoản có 2FA enabled. Hoàn tất quá trình đăng nhập 2FA.

## Endpoint

```
POST /api/v1/auth/verify-otp-2fa
```

## Headers

| Header | Value |
|--------|-------|
| Content-Type | application/json |
| x-api-key | `<API_KEY>` |
| x-device-id | `<DEVICE_ID>` |
| x-client-id | `<SESSION_ID>` |

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `otpCode` | string | Yes | Mã OTP từ ứng dụng authenticator |

### Example Request
```json
{
  "otpCode": "123456"
}
```

## Response

### Success (200 OK)
```json
{
  "message": "Success",
  "status": 200,
  "data": {
    "isValid": true,
    "token": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error (400 - Invalid OTP)
```json
{
  "message": "Success",
  "status": 200,
  "data": {
    "isValid": false
  },
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Headers Required

| Header | Description |
|--------|-------------|
| `x-client-id` | Session ID được trả về từ API login |

## Validation Rules

| Field | Rules |
|-------|-------|
| `otpCode` | - Required<br>- String<br>- 6 chữ số |

## Business Logic

1. **Lấy user từ session**: Sử dụng session ID từ header
2. **Verify OTP**: Kiểm tra mã OTP với secret key đã lưu
3. **Kích hoạt session**: Nếu OTP đúng, session sẽ được kích hoạt
4. **Xóa cache**: Xóa trạng thái session invalid trong Redis

## 2FA Login Flow

```
1. User gọi POST /auth/login với email/password
2. Server trả về:
   - session.isValid = false (vì 2FA enabled)
   - accessToken = null
   - session.id = "<SESSION_ID>"
3. User quét QR code bằng authenticator app để lấy OTP
4. User gọi POST /auth/verify-otp-2fa với:
   - otpCode: "<OTP_CODE>"
   - Header x-client-id: "<SESSION_ID>"
5. Nếu OTP đúng:
   - session.isValid = true
   - Trả về accessToken và refreshToken
6. User sử dụng accessToken để gọi các API protected
```

## OTP Validation

- Sử dụng thuật toán TOTP (Time-based One-Time Password)
- Mã OTP có hiệu lực trong 30 giây
- Cho phép sai 1 bước trước/sau để compensate clock skew

## Notes

- Session sẽ bị vô hiệu sau 5 phút nếu không verify OTP
- Sau khi verify thành công, user sẽ nhận được tokens
