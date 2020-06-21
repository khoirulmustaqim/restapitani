const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connect = require('./config/db');
const port = process.env.PORT || 5000;

connect.db;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'storage')));

const users = require('./route/users');
app.use('/user', users);

const artikel = require('./route/artikel');
app.use('/artikel', artikel);

const like = require('./route/Like');
app.use('/like', like);

const komentar = require('./route/komentar')
app.use('/komentar', komentar);

app.listen(port, () => console.log('Server berjalan di localhost 5000'));