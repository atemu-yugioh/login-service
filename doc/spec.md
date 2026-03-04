# Specification Document

## 1. Project Information

| Field | Value |
|-------|-------|
| Project Name | Login Service |
| Version | 1.0.0 |
| Node.js Version | >= 16.x |
| Port Default | 9999 |

## 2. Features

### 2.1 Authentication
- **User Registration**: Đăng ký tài khoản mới với email, phone, password
- **User Login**: Đăng nhập với email/password
- **JWT Token**: Access token sau khi login thành công
- **Refresh Token**: Xử lý token hết hạn
- **Logout**: Đăng xuất và vô hiệu hóa token
- **Change Password**: Đổi mật khẩu

### 2.2 Two-Factor Authentication (2FA)
- **Enable 2FA**: Bật tính năng 2FA, tạo QR code
- **Disable 2FA**: Tắt tính năng 2FA
- **Verify 2FA**: Xác thực với OTP code

### 2.3 User Management
- **Get Profile**: Lấy thông tin user theo ID
- **Update Profile**: Cập nhật thông tin cá nhân

### 2.4 API Key Management
- **Create API Key**: Tạo API key mới
- **Get API Key Detail**: Lấy thông tin API key

## 3. Database Models

### 3.1 User Collection
```javascript
{
  email: String (required, indexed),
  phone: String (required),
  name: String (required),
  password: String (required, hashed),
  secretKeyOTP: String (for 2FA),
  is2FAEnabled: Boolean (default: false),
  avatar: String,
  address: String,
  birthday: String,
  roles: Array<String> (default: ['user']),
  isDisable: Boolean (default: false),
  isDelete: Boolean (default: false),
  isDefault: Boolean (default: false),
  createdBy: ObjectId (ref: User),
  modifiedBy: ObjectId (ref: User),
  createdDate: Date,
  modifiedDate: Date
}
```

### 3.2 APIKey Collection
```javascript
{
  key: String,
  version: Number,
  permissions: Array<String>,
  isDisable: Boolean,
  createdDate: Date,
  modifiedDate: Date
}
```

### 3.3 Session Collection
```javascript
{
  user: ObjectId (ref: User),
  deviceId: String,
  deviceInfo: Object,
  token: String,
  refreshToken: String,
  isDisable: Boolean,
  createdDate: Date,
  modifiedDate: Date
}
```

## 4. API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/register | Register new user | No |
| POST | /api/v1/auth/login | Login | No |
| POST | /api/v1/auth/verify-otp-2fa | Verify 2FA | No |
| GET | /api/v1/auth/profile | Get current user | JWT |
| POST | /api/v1/auth/logout | Logout | JWT |
| POST | /api/v1/auth/handle-refresh-token | Refresh token | JWT |
| PATCH | /api/v1/auth/change-password | Change password | JWT |
| POST | /api/v1/auth/enable-2fa | Enable 2FA | JWT |
| POST | /api/v1/auth/disable-2fa | Disable 2FA | JWT |
| GET | /api/v1/user/profile/:id | Get user by ID | JWT |
| POST | /api/v1/api-key | Create API key | API Key |
| GET | /api/v1/api-key | Get API key | API Key |

## 5. Validation Schemas

### Register
- email: required, valid email format
- phone: required, valid phone format
- name: required, min 2 characters
- password: required, min 6 characters

### Login
- email: required, valid email
- password: required

### Change Password
- oldPassword: required
- newPassword: required, min 6 characters

## 6. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (test/dev/pro) | dev |
| PORT_APP | Application port | 9999 |
| DEV_PORT_APP | Dev environment port | 9999 |
| DEV_DB_HOST | MongoDB host | localhost |
| DEV_DB_PORT | MongoDB port | 27017 |
| MONGO_URL | MongoDB connection string | - |
| REDIS_URL | Redis connection string | redis://localhost:6379 |
| JWT_SECRET | JWT secret key | - |
| JWT_REFRESH_SECRET | Refresh token secret | - |

## 7. Dependencies

### Production
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT implementation
- bcrypt: Password hashing
- otplib: 2FA/TOTP
- qrcode: QR code generation
- redis: Redis client
- joi: Input validation
- i18next: Internationalization

### Development
- jest: Testing framework
- eslint: Code linting
- prettier: Code formatting
- husky: Git hooks
- nodemon: Auto-restart server
