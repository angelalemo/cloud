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

app.post('/users', express.json(), (req, res) => {
  const { id, username, password } = req.body;
  const data = fs.readFileSync('./data/data.json', 'utf-8');
  const users = JSON.parse(data);
  users.push({ id, username, password });
  fs.writeFileSync('./data/data.json', JSON.stringify(users));
  res.json({ success: true });
});

app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = fs.readFileSync('./data/data.json', 'utf-8');
  const users = JSON.parse(data);
  const updatedUsers = users.filter(user => user.id !== id);
  fs.writeFileSync('./data/data.json', JSON.stringify(updatedUsers, null, 2));
  res.json({ success: true });
});

module.exports = app;