## Tổng quan kiến trúc

Dự án `login-service` là một **RESTful API service** xây bằng **Node.js + Express**, kết nối **MongoDB** để lưu trữ dữ liệu và sử dụng **Redis** cho các tác vụ pub/sub và session/expire event.

- **Entry point**: `server.js` khởi chạy `app` từ `src/app.js` và bind vào cổng cấu hình trong `src/configs/app.config.js`.
- **Web framework**: `Express` với middleware `compression`, `morgan`, `helmet`, `express.json`, `express.urlencoded`.
- **Quốc tế hóa (i18n)**: `i18next` + `i18next-fs-backend` + `i18next-http-middleware`, load file ngôn ngữ từ thư mục `locales`.
- **CSDL chính**: `MongoDB` thông qua `mongoose`, khởi tạo trong `src/dbs/init.mongodb.js` (import từ `src/dbs/index.js`).
- **Redis**: dùng cho pub/sub và xử lý event liên quan đến token/session (`src/services/redis/*.js`).

Kiến trúc được tổ chức theo **layered architecture** với các layer chính:

- **Routes layer**: định nghĩa endpoint HTTP, gắn middleware và map đến controller (`src/routes`).
- **Controller layer**: nhận request, gọi service tương ứng, xử lý response (`src/controllers`).
- **Service layer**: chứa business logic, thao tác với repository/model, gọi third-party service (`src/services`).
- **Repository & Model layer**: định nghĩa schema Mongoose và builder query (`src/models`, `src/models/repositories`).
- **Core / Utils / Helpers**: cung cấp các tiện ích, chuẩn hóa response, xử lý validation, email, SMS, 2FA… (`src/core`, `src/utils`, `src/helpers`).

## Luồng request chính

1. **Client** gọi `HTTP request` vào `server.js` (qua Express app).
2. `src/app.js`:
   - Khởi tạo middleware chung (gzip, log, bảo mật, parse body).
   - Khởi tạo database `MongoDB` và `Redis`.
   - Khởi tạo i18n.
   - Mount router chính tại `/api/v1` (`src/routes/index.js`).
3. **Router chính**:
   - Áp dụng `rateLimiter`, `requiredApiKey`, `requiredDevice`.
   - Điều hướng tới:
     - `/api/v1/api-key` → module quản lý API key.
     - `/api/v1/auth` → module xác thực, đăng nhập, 2FA…
     - `/api/v1/user` → module người dùng.
4. **Controller** nhận request, validate (kết hợp helper/validator), gọi **Service** tương ứng.
5. **Service**:
   - Gọi **Repository** (truy vấn với Mongoose).
   - Gọi **Redis service** (nếu cần).
   - Gọi **email/SMS/2FA helper**.
6. Kết quả được chuẩn hóa qua `src/core/success.response.js` hoặc ném `Error` custom để `app.js` bắt và trả response lỗi nhất quán.

## Cấu trúc thư mục chính

- `server.js`: entry khởi động HTTP server.
- `src/app.js`: khởi tạo Express app, middleware, route, i18n, Redis listener.
- `src/routes/`: khai báo route:
  - `index.js`: router gốc `/api/v1`.
  - `auth/`, `user/`, `apiKey/`: từng module chức năng.
- `src/controllers/`: controller cho từng module (`auth.controller.js`, `user.controller.js`, `apiKey.controller.js`).
- `src/services/`:
  - `auth.service.js`, `user.service.js`, `apiKey.service.js`, `session.service.js`.
  - `redis/*.service.js`: service làm việc với Redis (pub/sub, expire event…).
- `src/models/`:
  - Model mongoose (`user.model.js`, `session.model.js`, `apiKey.model.js`).
  - Repository (`src/models/repositories/*.repositories.js`).
- `src/dbs/`:
  - `init.mongodb.js`, `init.redis.js`, `index.js`: khởi tạo kết nối database.
- `src/middlewares/`:
  - `authentication.middleware.js`, `rateLimiter.middleware.js`.
- `src/auth/checkAuth.js`: middleware auth (apiKey, device, permission).
- `src/helpers/`:
  - `email*`, `sms/`, `2FA/`, `validations/`, `asyncHandler.js`.
- `src/core/`:
  - `success.response.js`, `error.response.js`.
- `src/configs/`:
  - `app.config.js`, `mongodb.config.js`, `constant.config.js`, `configTest.js`.

## Các quyết định kiến trúc chính

- **Tách rõ layer**: route → controller → service → repository → model giúp dễ bảo trì, test, thay đổi logic.
- **Sử dụng Redis pub/sub** để xử lý event liên quan tới session/token, giảm coupling giữa các thành phần.
- **Sử dụng i18n** từ middleware sớm để message lỗi/thành công đều có thể dịch theo ngôn ngữ client.
- **Dùng middleware chuỗi ở router gốc** (rate limit, apiKey, device, permission) để:
  - Bảo vệ toàn bộ API.
  - Giảm lặp code ở từng route con.
- **Chuẩn hóa response** thông qua `success.response` và `error.response` để API có format thống nhất.

## Hướng mở rộng

- Tách `auth`, `user`, `apiKey` thành module rõ ràng hơn (có `index.ts`/`index.js` cho service/controller).
- Bổ sung diagram sequence cho các flow quan trọng: đăng ký, đăng nhập, refresh token, 2FA.
- Tách cấu hình (port, DB, Redis, JWT, email, SMS) sang file `.env` + `config` rõ ràng hơn và document chi tiết ở `doc/spec.md`.

