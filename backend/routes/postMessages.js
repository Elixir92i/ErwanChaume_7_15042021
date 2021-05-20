// Importation du module express 
const express = require('express');
// Importation du module router
const router = express.Router();

// Importation du controller user
const messageCtrl = require('../controllers/postMessage');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route création d'un message
router.post('/timeline', auth, messageCtrl.createMessage);
// Route supression d'un message
router.delete('/timeline/:message_id', auth, messageCtrl.deleteMessage);
// Route récupération d'un message
router.get('/timeline/:message_id', auth, messageCtrl.getMessage);
// Route récupération de tous les messages
router.get('/timeline', auth, messageCtrl.getMessages);
// Route de like ou dislike d'un message
router.post('/timeline/:message_id/like', auth, messageCtrl.likeMessage);

module.exports = router;