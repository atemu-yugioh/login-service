## Yêu cầu môi trường

- **Node.js**: >= 18 (khuyến nghị).
- **MongoDB**: chạy local hoặc qua connection string (Atlas…).
- **Redis**: chạy local hoặc qua `REDIS_URL`.
- **npm**: đi kèm Node.js.

## Cài đặt dependencies

Trong thư mục gốc dự án:

```bash
npm install
```

## Cấu hình biến môi trường

Tạo file `.env` (hoặc dùng `.env.test` khi chạy test) với các biến tối thiểu (ví dụ gợi ý):

```bash
NODE_ENV=dev

DEV_PORT_APP=9999

DEV_DB_HOST=localhost
DEV_DB_PORT=27017
MONGO_URL=mongodb://localhost:27017/loginDev

REDIS_URL=redis://localhost:6379

# Ví dụ: secret cho JWT, 2FA, email, SMS...
JWT_SECRET=your_jwt_secret
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
```

> Thực tế có thể cần thêm biến khác. Xem chi tiết trong `src/configs/*.js`, `src/helpers/email*/`, `src/helpers/sms/`.

## Chạy ứng dụng (development)

```bash
npm start
```

- Script `start` sẽ chạy `nodemon server.js`.
- `server.js` sẽ:
  - Đọc cấu hình từ `src/configs/app.config.js` dựa trên `NODE_ENV`.
  - Khởi tạo `app` từ `src/app.js`.
  - Lắng nghe trên `port` đã cấu hình.

Mặc định (nếu không override) port dev là `9999`, vì vậy API base sẽ là:

- `http://localhost:9999/api/v1`

## Chạy test

```bash
npm test
```

- Dùng `jest`, các test nằm trong thư mục `__test__/`.
- Có thể dùng:

```bash
npm run test:watch
```

để chạy test theo chế độ watch.

## Chạy với Docker

Trong dự án đã có `Dockerfile` và `docker-compose.yaml`. Cách chạy gợi ý:

```bash
docker-compose up --build
```

Hoặc:

```bash
docker build -t login-service .
docker run --env-file .env -p 9999:9999 login-service
```

> Tùy chỉnh `docker-compose.yaml` và `Dockerfile` nếu muốn map port khác hoặc cấu hình Mongo/Redis qua container.

## Health check nhanh

Sau khi chạy app:

- Gọi một endpoint public (ví dụ login hoặc một route health nếu đã được định nghĩa).
- Kiểm tra log từ `morgan` và console để chắc chắn Mongo/Redis connect thành công.

