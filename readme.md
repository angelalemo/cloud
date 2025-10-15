# 📚 Cloud Application - Deployment & Pipeline Documentation

## 🔹 ภาพรวมระบบ (System Overview)

### เทคโนโลยีหลัก (Main Technologies)
- **Backend**: Node.js + Express.js
- **Testing**: Jest (Unit Testing + Integration Testing)
- **Container**: Docker
- **CI/CD**: GitHub Actions
- **Development**: Nodemon for hot reloading

### คุณสมบัติหลัก (Key Features)
- ระบบจัดการผู้ใช้ (User Management System)
- ระบบ Authentication (Login System)
- API endpoints สำหรับ CRUD operations
- การทดสอบแบบ Unit และ Integration
- Docker containerization
- Automated CI/CD pipeline

## 🔹 โครงสร้างโปรเจค (Project Structure)

```
cloud/
├── 📁 data/
│   └── data.json                    # ฐานข้อมูลผู้ใช้
├── 📁 tests/
│   ├── 📁 unit/                     # Unit Tests
│   │   ├── addusers.test.js
│   │   ├── deleteusers.test.js
│   │   ├── loginsuccess.test.js
│   │   ├── passwordEmpthy.test.js
│   │   ├── passwordincorrect.test.js
│   │   ├── usernameEmpty.test.js
│   │   └── usernameisincorrect.test.js
│   └── 📁 integration/              # Integration Tests
│       └── app.integration.test.js
├── 📄 app.js                        # Main Express application
├── 📄 server.js                     # Server entry point
├── 📄 addusers.js                   # User addition logic
├── 📄 deleteusers.js                # User deletion logic
├── 📄 index.js                      # Application index
├── 📄 login.html                    # Login page
├── 📄 login.css                     # Login page styles
├── 📄 package.json                  # Dependencies & scripts
├── 📄 jest.unit.config.js           # Jest unit test config
├── 📄 jest.integration.config.js    # Jest integration test config
└── 📄 Dockerfile                    # Docker configuration
```

## 🔹 การติดตั้งและรัน (Installation & Running)

### Prerequisites
- Node.js (version 20+)
- npm หรือ yarn
- Docker (สำหรับ containerization)

### การติดตั้ง (Installation)
```bash
# Clone repository
git clone <repository-url>
cd cloud

# ติดตั้ง dependencies
npm install

# รันแอปพลิเคชัน
npm start
```

### การรัน (Running)
```bash
# รันแอปพลิเคชันในโหมด development
npm start

# รัน unit tests
npm run test:unit

# รัน integration tests
npm run test:integration

# รัน tests ทั้งหมด
npm test
```

## 🔹 API Endpoints

### Authentication & User Management
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | หน้า Login | - |
| GET | `/users` | ดึงข้อมูลผู้ใช้ทั้งหมด | - |
| POST | `/users` | เพิ่มผู้ใช้ใหม่ | `{id, username, password}` |
| POST | `/adminfunc` | เพิ่ม Admin | `{id, adminusername, adminpassword}` |
| DELETE | `/users/:id` | ลบผู้ใช้ตาม ID | - |

### Response Examples
```json
// POST /users
{
  "success": true
}

// POST /adminfunc
{
  "success": true,
  "message": "Admin added successfully",
  "admin": {
    "id": 1,
    "username": "admin"
  }
}

// GET /users
[
  {
    "id": 1,
    "username": "user1",
    "password": "password123"
  }
]
```

## 🔹 การทดสอบ (Testing)

### Test Configuration
- **Unit Tests**: `jest.unit.config.js`
- **Integration Tests**: `jest.integration.config.js`
- **Test Environment**: Node.js

### Test Cases

| TC | Test Case | Expected Output | Type |
|----|-----------|-----------------|------|
| TC01 | เพิ่มผู้ใช้ใหม่ | "User added successfully" | Unit |
| TC02 | ลบผู้ใช้ที่มีอยู่ | "User deleted successfully" | Unit |
| TC03 | username ผิด | "Username is incorrect" | Unit |
| TC04 | password ผิด | "Password is incorrect" | Unit |
| TC05 | password ว่าง | "Password cannot be empty" | Unit |
| TC06 | login สำเร็จ | "Login successful" | Integration |
| TC07 | ดึงข้อมูล /users | JSON ของผู้ใช้ | Integration |
| TC08 | Add user | พบ User ที่เพิ่มเข้าไป | Integration |
| TC09 | Delete user | ไม่พบ User ที่เพิ่มเข้าไป | Integration |

## 🔹 Docker Configuration

### Dockerfile
```dockerfile
# Stage 1: Build and Test
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test

# Stage 2: Run
FROM node:20
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Commands
```bash
# Build Docker image
docker build -t cloud-app:latest .

# Run container
docker run -p 3000:3000 cloud-app:latest

# Run in detached mode
docker run -d -p 3000:3000 cloud-app:latest
```

## 🔹 CI/CD Pipeline (GitHub Actions)

### Workflow File: `.github/workflows/docker-deploy.yml`

```yaml
name: CI/CD with Docker

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-test-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run Tests
        run: |
          npm install
          npm test -- --config jest.unit.config.js
          npm test -- --config jest.integration.config.js

      - name: Build Docker image
        run: docker build -t cloud-app:latest .

      - name: Save Docker image as artifact
        uses: actions/upload-artifact@v4
        with:
          name: cloud-docker-image
          path: |
            $(docker save cloud-app:latest | gzip > cloud-app.tar.gz)
```

### Pipeline Steps
1. **Checkout**: ดึงโค้ดจาก repository
2. **Setup**: ติดตั้ง Node.js version 20
3. **Test**: รัน unit และ integration tests
4. **Build**: สร้าง Docker image
5. **Artifact**: บันทึก Docker image เป็น artifact

## 🔹 Dependencies

### Production Dependencies
```json
{
  "express": "^5.1.0",
  "fs": "^0.0.1-security",
  "nodemon": "^3.1.10"
}
```

### Development Dependencies
```json
{
  "cross-env": "^10.1.0",
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "jsdom": "^27.0.0",
  "supertest": "^7.1.4"
}
```

## 🔹 Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
```

## 🔹 Troubleshooting

### Common Issues
1. **Port already in use**: เปลี่ยน PORT ใน server.js
2. **Test failures**: ตรวจสอบ data.json format
3. **Docker build fails**: ตรวจสอบ Dockerfile syntax

### Logs
```bash
# ดู logs ของ Docker container
docker logs <container-id>

# ดู logs แบบ real-time
docker logs -f <container-id>
```

## 🔹 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🔹 License

ISC License

## 🔹 Contact

สำหรับคำถามหรือข้อเสนอแนะ กรุณาติดต่อผ่าน GitHub Issues

---

**หมายเหตุ**: เอกสารนี้อัปเดตล่าสุดเมื่อวันที่ $(date)
