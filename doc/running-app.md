# Running Application Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 16.x |
| npm | >= 8.x |
| Docker | Latest |
| Docker Compose | Latest |

## 1. Local Development

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Configure Environment Variables

Create `.env` file in root directory:
```env
NODE_ENV=dev
PORT_APP=9999
DEV_PORT_APP=9999
DEV_DB_HOST=localhost
DEV_DB_PORT=27017
MONGO_URL=mongodb://localhost:27017/loginDev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### 1.3 Start MongoDB and Redis (Docker)
```bash
docker-compose up -d mongodb redis
```

### 1.4 Run Application
```bash
# Development mode (auto-restart on changes)
npm start

# Or run directly
node server.js
```

The server will start on `http://localhost:9999`

---

## 2. Docker Deployment

### 2.1 Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down
```

### 2.2 Manual Docker Build
```bash
# Build image
docker build -t login-service .

# Run container
docker run -d -p 9999:9999 --name login-api \
  --link mongodb:mongodb \
  --link redis:redis \
  -e NODE_ENV=pro \
  -e MONGO_URL=mongodb://mongodb:27017/loginPro \
  -e REDIS_URL=redis://redis:6379 \
  login-service
```

---

## 3. Testing

### 3.1 Run All Tests
```bash
npm test
```

### 3.2 Run Tests in Watch Mode
```bash
npm run test:watch
```

### 3.3 Test with Coverage
```bash
npm test -- --coverage
```

---

## 4. Code Quality

### 4.1 Lint Code
```bash
npm run lint
```

### 4.2 Auto-fix Lint Issues
```bash
npm run lint:fix
```

### 4.3 Check Formatting
```bash
npm run prettier
```

### 4.4 Auto-fix Formatting
```bash
npm run prettier:fix
```

---

## 5. Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check code linting |
| `npm run lint:fix` | Fix linting issues |
| `npm run prettier` | Check code formatting |
| `npm run prettier:fix` | Fix formatting issues |

---

## 6. API Documentation

Once the server is running, API documentation is available at:
- Swagger UI: Not integrated (manual docs in `/doc/api.md`)

---

## 7. Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Restart MongoDB container
docker-compose restart mongodb
```

### Redis Connection Error
```bash
# Check Redis status
docker-compose logs redis

# Restart Redis
docker-compose restart redis
```

### Port Already in Use
```bash
# Find process using port 9999
lsof -i :9999

# Kill the process
kill -9 <PID>
```

### Clear Node Modules and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 8. Production Deployment

### Using PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name login-service

# View logs
pm2 logs login-service

# Restart
pm2 restart login-service
```

### Using Deploy Script
```bash
./deploy.sh
```
