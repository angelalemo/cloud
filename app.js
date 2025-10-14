const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './login.html'));
});

app.get('/users', (req, res) => {
  const data = fs.readFileSync('./data/data.json', 'utf-8');
  const users = JSON.parse(data);
  res.json(users);
});

module.exports = app;