const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));
app.use(express.json()); // เพิ่ม middleware สำหรับ parse JSON

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './login.html'));
});

app.get('/users', (req, res) => {
  const data = fs.readFileSync('./data/data.json', 'utf-8');
  const users = JSON.parse(data);
  res.json(users);
});

app.post('/users', (req, res) => {
  const { id, username, password } = req.body;
  const data = fs.readFileSync('./data/data.json', 'utf-8');
  const users = JSON.parse(data);
  users.push({ id, username, password });
  fs.writeFileSync('./data/data.json', JSON.stringify(users));
  res.json({ success: true });
});

// เพิ่ม endpoint สำหรับ add admin
app.post('/adminfunc', (req, res) => {
  try {
    const { id, adminusername, adminpassword } = req.body;

    // Validation
    if (!id || !adminusername || !adminpassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields (id, adminusername, adminpassword) are required' 
      });
    }

    // อ่านข้อมูลปัจจุบัน
    const dataPath = path.join(__dirname, './data/data.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    const users = JSON.parse(data);

    // ตรวจสอบว่า id หรือ username ซ้ำหรือไม่
    const existingUser = users.find(user => 
      user.id === parseInt(id) || user.username === adminusername
    );

    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Admin with this ID or username already exists' 
      });
    }

    // เพิ่ม admin ใหม่
    const newAdmin = {
      id: parseInt(id),
      username: adminusername,
      password: adminpassword
    };

    users.push(newAdmin);
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));

    res.status(200).json({ 
      success: true, 
      message: 'Admin added successfully',
      admin: { id: newAdmin.id, username: newAdmin.username }
    });

  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = app;