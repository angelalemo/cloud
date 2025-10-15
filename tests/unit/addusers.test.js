/**
 * Unit Test: Add Admin Function
 */

const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../app.js');

// Mock fs module
jest.mock('fs');

describe('Unit Test: Add Admin Function', () => {
  const dataPath = path.join(__dirname, '../../data/data.json');
  
  beforeEach(() => {
    // Reset mocks ก่อนแต่ละ test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
    jest.restoreAllMocks();
  });

  // Test 1: เพิ่ม user สำเร็จ
  test('should successfully add a new user', async () => {
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123' }
    ];

    // Mock fs.readFileSync
    fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
    
    // Mock fs.writeFileSync
    fs.writeFileSync.mockImplementation(() => {});

    const newAdmin = {
      id: '2',
      adminusername: 'newadmin',
      adminpassword: 'newpass123'
    };

    const res = await request(app)
      .post('/adminfunc')
      .send(newAdmin);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Admin added successfully');
    expect(res.body.admin).toHaveProperty('id', 2);
    expect(res.body.admin).toHaveProperty('username', 'newadmin');
    
    // ตรวจสอบว่า fs.writeFileSync ถูกเรียก
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  });

  // Test 2: ไม่มี id (Missing required field)
  test('should return error when id is missing', async () => {
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123' }
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

    const incompleteAdmin = {
      adminusername: 'newadmin',
      adminpassword: 'newpass123'
    };

    const res = await request(app)
      .post('/adminfunc')
      .send(incompleteAdmin);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('required');
    
    // ตรวจสอบว่าไม่มีการเขียนไฟล์
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  // Test 3: ไม่มี username (Missing required field)
  test('should return error when adminusername is missing', async () => {
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123' }
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

    const incompleteAdmin = {
      id: '2',
      adminpassword: 'newpass123'
    };

    const res = await request(app)
      .post('/adminfunc')
      .send(incompleteAdmin);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('required');
    
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  // Test 4: ไม่มี password (Missing required field)
  test('should return error when adminpassword is missing', async () => {
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123' }
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

    const incompleteAdmin = {
      id: '2',
      adminusername: 'newadmin'
    };

    const res = await request(app)
      .post('/adminfunc')
      .send(incompleteAdmin);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('required');
    
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  // Test 5: ID ซ้ำ (Duplicate ID)
  test('should return error when admin ID already exists', async () => {
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123' },
      { id: 2, username: 'admin2', password: 'pass123' }
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

    const duplicateAdmin = {
      id: '2', // ID ซ้ำกับที่มีอยู่
      adminusername: 'newadmin',
      adminpassword: 'newpass123'
    };

    const res = await request(app)
      .post('/adminfunc')
      .send(duplicateAdmin);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('already exists');
    
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  // Test 6: Username ซ้ำ (Duplicate Username)
  test('should return error when username already exists', async () => {
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123' },
      { id: 2, username: 'existinguser', password: 'pass123' }
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

    const duplicateAdmin = {
      id: '3',
      adminusername: 'existinguser', // Username ซ้ำ
      adminpassword: 'newpass123'
    };

    const res = await request(app)
      .post('/adminfunc')
      .send(duplicateAdmin);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('already exists');
    
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  // Test 7: Empty strings (ส่งค่าว่างมา)
  test('should return error when fields are empty strings', async () => {
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123' }
    ];

    fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

    const emptyAdmin = {
      id: '',
      adminusername: '',
      adminpassword: ''
    };

    const res = await request(app)
      .post('/adminfunc')
      .send(emptyAdmin);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

});