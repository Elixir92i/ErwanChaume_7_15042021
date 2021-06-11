// Importation du module express 
const express = require('express');
// Importation du module router
const router = express.Router();

// Importation du controller user
const userCtrl = require('../controllers/user');
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route création d'un utilisateur
router.post('/signup', userCtrl.signup);
// Route connexion d'un utilisateur
router.post('/login', userCtrl.login);
// Route modification d'un utilisateur
router.put('/user-profile/:user_id', auth, multer, userCtrl.update);
// Route de modification du mot de passe
router.put('/user-profile/:user_id/password', auth, multer, userCtrl.updatePassword);
// Route supression d'un utilisateur
router.delete('/user-profile/:user_id', auth, multer, userCtrl.delete);
// Route récupération d'un utilisateur
router.get('/user-profile/:user_id', auth, multer, userCtrl.getUser);

module.exports = router;
