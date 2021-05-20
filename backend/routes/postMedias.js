// Importation du module express 
const express = require('express');
// Importation du module router
const router = express.Router();

// Importation du controller user
const mediaCtrl = require('../controllers/postMedia');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route création d'un media
router.post('/timeline', auth, multer, mediaCtrl.createMedia);
// Route supression d'un media
router.delete('/timeline/:media_id', auth, multer, mediaCtrl.deleteMedia);
// Route récupération d'un media
router.get('/timeline/:media_id', auth, multer, mediaCtrl.getMedia);
// Route récupération de tous les medias
router.get('/timeline/', auth, multer, mediaCtrl.getMedias);
// Route de like ou dislike d'un media
router.post('/timeline/:media_id/like', auth, mediaCtrl.likeMedia);

module.exports = router;