// Importation du module express 
const express = require('express');
// Importation du module router
const router = express.Router();

// Importation du controller user
const postCtrl = require('../controllers/post');
const likeCtrl = require('../controllers/like')
const commentCtrl = require('../controllers/comment')
const auth = require('../middleware/auth');
const multerMedias = require('../middleware/multer-config-medias');

// Route création d'un Post
router.post('/timeline/message', auth, multerMedias, postCtrl.createPostMessage);
// Route création d'un Post
router.post('/timeline/media', auth, multerMedias, postCtrl.createPostMedia);
// Route supression d'un Post
router.delete('/timeline/:post_id', auth, multerMedias, postCtrl.deletePost);
// Route récupération d'un Post
router.get('/timeline/:post_id', auth, multerMedias, postCtrl.getPost);
// Route récupération de tous les Posts
router.get('/messages/', auth, multerMedias, postCtrl.getPostsMessages);
// Route récupération de tous les Posts
router.get('/medias/', auth, multerMedias, postCtrl.getPostsMedias);
// Route récupération de tous les Posts
router.get('/timeline/', auth, multerMedias, postCtrl.getPosts);
// Route de like d'un Post
router.post('/timeline/:post_id/like', auth, likeCtrl.likePost);
// Route pour créer un commentaire
router.post('/timeline/:post_id/comment', auth, commentCtrl.createComment);
// Route pour supprimer un commentaire
router.delete('/timeline/:post_id/comment/:comment_id', auth, commentCtrl.deleteComment);

module.exports = router;