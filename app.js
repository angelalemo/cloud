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

module.exports = app;