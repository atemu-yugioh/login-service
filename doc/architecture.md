# Architecture Documentation

## 1. Project Overview

**Login Service** là một REST API service xử lý authentication và user management, được xây dựng trên nền tảng Node.js với Express framework.

## 2. Technology Stack

| Layer | Technology |
|-------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Cache/Message Queue | Redis |
| Authentication | JWT + 2FA (TOTP) |
| Validation | Joi |
| Internationalization | i18next |
| Security | Helmet, bcrypt |
| Testing | Jest, Supertest |

## 3. Project Structure

```
claude-code/
├── src/
│   ├── auth/              # Authentication middleware
│   ├── configs/           # Configuration files
│   ├── controllers/       # Route controllers
│   ├── core/              # Core utilities (responses)
│   ├── dbs/               # Database initialization
│   ├── helpers/           # Helper utilities
│   │   ├── 2FA/           # Two-factor authentication
│   │   ├── email/         # Email services
│   │   ├── sms/           # SMS services
│   │   └── validations/   # Input validation schemas
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   │   └── repositories/  # Data access layer
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   │   └── redis/         # Redis services
│   └── utils/             # Utility functions
├── locales/               # i18n translation files
├── __test__/              # Test files
└── doc/                   # Documentation
```

## 4. Architecture Layers

### 4.1 Routes Layer (`src/routes/`)
- Định nghĩa các API endpoints
- Áp dụng middleware (rate limiting, authentication)
- Input validation

### 4.2 Controllers Layer (`src/controllers/`)
- Xử lý request/response
- Gọi services tương ứng

### 4.3 Services Layer (`src/services/`)
- Business logic chính
- Xử lý nghiệp vụ

### 4.4 Models/Repositories Layer (`src/models/`)
- Định nghĩa schema database
- Truy xuất dữ liệu

### 4.5 Middleware Layer
- `authentication.middleware.js`: Xác thực JWT token
- `rateLimiter.middleware.js`: Rate limiting
- `checkAuth.js`: API Key validation

## 5. Data Flow

```
Client Request
    ↓
Routes (Validation, Rate Limit)
    ↓
Controllers
    ↓
Services (Business Logic)
    ↓
Repositories (Database Access)
    ↓
MongoDB / Redis
```

## 6. Security Features

1. **API Key Authentication**: Mỗi request cần valid API key
2. **JWT Token**: Xác thực người dùng sau login
3. **2FA (TOTP)**: Two-factor authentication với QR code
4. **Password Hashing**: Sử dụng bcrypt
5. **Rate Limiting**: Giới hạn request (30 requests/15s)
6. **Helmet**: HTTP security headers
7. **Input Validation**: Joi schema validation

## 7. Infrastructure

### Docker Services
- **API**: Node.js application (port 9999)
- **MongoDB**: Database (port 27017)
- **Redis**: Cache/Pub-Sub (port 6379)

### Environment Configurations
- `test`: Testing environment
- `dev`: Development environment
- `pro`: Production environment
