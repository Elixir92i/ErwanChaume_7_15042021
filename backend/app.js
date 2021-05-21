const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mysql = require('mysql2');
require('dotenv').config();

const usersRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');


//
const sequelize = require('./utils/database');
const User = require('./models/User');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Like = require('./models/like');


sequelize.sync();

//

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());



app.use('/api/users', usersRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images/medias', express.static(path.join(__dirname, 'images/medias')));
app.use('/api/post', postRoutes);

module.exports = app;