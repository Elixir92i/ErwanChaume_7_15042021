// Importation du modèle des medias
const Post = require('../models/post');
const User = require('../models/User');
const Like = require('../models/like');
const user = require('./user')
// Importation du module fs 
const fs = require('fs');

// hasMany
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

// Créer une media
exports.createPostMedia = (req, res, next) => {
    // Récupération des informations du formulaire de création de media
    const postObject = JSON.parse(req.body.post);
    // Ajout des valeurs like et dislike par défaut = 0
    postObject.likes = 0;
    postObject.dislikes = 0;
    // Création dans la base de donnée de la media avec l'image associée au mediaObject
    const post = new Post({
        ...postObject,
        mediaUrl: `${req.protocol}://${req.get('host')}/images/medias/${req.file.filename}`
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Post publié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Créer un message
exports.createPostMessage = (req, res, next) => {
    // Récupération des informations du formulaire de création de message
    const postObject = req.body;
    // Ajout des valeurs like et dislike par défaut = 0
    postObject.likes = 0;
    postObject.dislikes = 0;
    // Création dans la base de donnée du message
    const post = new Post({
        ...postObject
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Message publié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprimer un media
exports.deletePost = (req, res, next) => {
    // Recherche de la media grâce à son ID
    Post.findOne({ where: { post_id: req.params.post_id } })
        .then(post => {
            const media = post.mediaUrl;
            if (post.mediaUrl) {
                // Suppression de l'image associée dans la base de donnée
                const filename = post.mediaUrl.split('/images/medias/')[1];
                fs.unlink(`images/medias/${filename}`, () => {
                    // Suppression de la media dans la base de donnée
                    Post.destroy({ where: { post_id: req.params.post_id } })
                        .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
            else {
                Post.destroy({ where: { post_id: req.params.post_id } })
                        .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// Affichage d'un post
exports.getPost = (req, res, next) => {
    Post.findOne({ include:  {all: true}, where: { post_id: req.params.post_id } })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

// Affichage de tous les posts
exports.getPosts = (req, res, next) => {
    Post.findAll({ include: {all: true} })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};