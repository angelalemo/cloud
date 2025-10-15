อกสารแผนการ Deploy และ Pipeline อัตโนมัติ (Automation Deployment – Docker Version)
🔹 ภาพรวมระบบ

เทคโนโลยีหลัก: Node.js + Express

การทดสอบ: Jest (unit / integration)

ระบบจัดการ container: Docker

Pipeline Automation: GitHub Actions (CI/CD)

🔹 โครงสร้างไฟล์สำคัญ
cloud/
├── app.js
├── server.js
├── addusers.js
├── deleteusers.js
├── index.js
├── data/data.json
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── jest.unit.config.js
├── jest.integration.config.js
└── Dockerfile

🔹 ตัวอย่าง Dockerfile
# Stage 1: Build and Test
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test -- --config jest.unit.config.js
RUN npm test -- --config jest.integration.config.js

# Stage 2: Run
FROM node:20
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "server.js"]

Pipeline (GitHub Actions)

ไฟล์: .github/workflows/docker-deploy.yml

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

Test Specification Document
หมายเลข	Test Case	          Expected Output	        Type	        
TC01	เพิ่มผู้ใช้ใหม่		 “User added successfully”	     Unit	         
TC02	ลบผู้ใช้ที่มีอยู่	  “User deleted successfully”  	  Unit	            
TC03	username ผิด	“Username is incorrect”	        Unit	
TC04	password ผิด	“Password is incorrect”	        Unit	
TC05	password ว่าง	 “Password cannot be empty”	     Unit	
TC06	login สำเร็จ	 “Login successful”	           Integration	
TC07	ดึงข้อมูล /users          JSON ของผู้ใช้	       Integration	
TC08	Add user            พบ User ที่เพิ่มเข้าไป	      Integration
TC09    Delete user        ไม่พบ User ที่เพิ่มเข้าไป	   Integration