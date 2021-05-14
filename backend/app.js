const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mysql = require('mysql2');
require('dotenv').config();

const usersRoutes = require('./routes/users');

//
const sequelize = require('./utils/database');
const User = require('./models/User');
const PostMedia = require('./models/postMedia');
const PostMessage = require('./models/postMessage');

sequelize.sync();

//

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/users', usersRoutes);

module.exports = app;