// Importation du module express 
const express = require('express');
// Importation du module router
const router = express.Router();

// Importation du controller user
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multerMedia = require('../middleware/multer-config-medias');

// Route création d'un Post
router.post('/timeline/message', auth, multerMedia, postCtrl.createPostMessage);
// Route création d'un Post
router.post('/timeline/media', auth, multerMedia, postCtrl.createPostMedia);
// Route supression d'un Post
router.delete('/timeline/:post_id', auth, multerMedia, postCtrl.deletePost);
// Route récupération d'un Post
router.get('/timeline/:post_id', auth, multerMedia, postCtrl.getPost);
// Route récupération de tous les Posts
router.get('/timeline/', auth, multerMedia, postCtrl.getPosts);
// Route de like ou dislike d'un Post
router.post('/timeline/:post_id/like', auth, postCtrl.likePost);

module.exports = router;