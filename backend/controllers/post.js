// Importation des modèles
const Post = require('../models/post');
const User = require('../models/User');
const Comment = require('../models/comment');

// Importation du module fs 
const fs = require('fs');

// hasMany
User.hasMany(Post, { foreignKey: 'user_id', onDelete: 'cascade', hooks: true });
Post.belongsTo(User, { foreignKey: 'user_id' });

// Créer un media
exports.createPostMedia = (req, res, next) => {
    // Récupération des informations du formulaire de création d'un media
    const postObject = JSON.parse(req.body.post);
    // Création dans la base de donnée du media avec l'image associée au postObject
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
    // Création dans la base de donnée du message
    const post = new Post({
        ...postObject
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Message publié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprimer un post
exports.deletePost = (req, res, next) => {
    const user_id = res.locals.userId;
    // Vérification de l'utilisateur connecté
    var user = User.findOne({ where: { user_id: user_id } })
        .then(user => {
            var admin = user.admin;
            // Si l'utilisateur est admin
            if (admin === true) {
                // Recherche du post séléctionné
                Post.findOne({ where: { post_id: req.params.post_id } })
                    .then(post => {
                        // Si le post contient une image
                        if (post.mediaUrl) {
                            // Suppression de l'image associée dans la base de donnée
                            const filename = post.mediaUrl.split('/images/medias/')[1];
                            fs.unlink(`images/medias/${filename}`, () => {
                                // Suppression du post dans la base de donnée
                                Post.destroy({ where: { post_id: req.params.post_id } })
                                    .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                                    .catch(error => res.status(400).json({ error }));
                            });
                        }
                        // Si le post ne contient pas d'image
                        else {
                            // Suppression du post dans la base de donnée
                            Post.destroy({ where: { post_id: req.params.post_id } })
                                .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                                .catch(error => res.status(400).json({ error }));
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
            // Si l'utilisateur n'est pas admin
            else if (admin === false) {
                // Recherche du post séléctionné
                Post.findOne({ where: { post_id: req.params.post_id, user_id: user_id } })
                    .then(post => {
                        // Si le post séléctionné ne regroupe pas ces paramètres -> annulation
                        if (post === null) {
                            res.status(403).json({ "error": "Accès interdit" });
                            return;
                        }
                        // Si "post" n'est pas "null" -> continuer
                        // Si le post contient une image
                        if (post.mediaUrl) {
                            // Suppression de l'image associée dans la base de donnée
                            const filename = post.mediaUrl.split('/images/medias/')[1];
                            fs.unlink(`images/medias/${filename}`, () => {
                                // Suppression du post dans la base de donnée
                                Post.destroy({ where: { post_id: req.params.post_id, user_id: user_id } })
                                    .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                                    .catch(error => res.status(400).json({ error }));
                            });
                        }
                        // Si le post ne contient pas d'image
                        else {
                            // Suppression du post dans la base de donnée
                            Post.destroy({ where: { post_id: req.params.post_id, user_id: user_id } })
                                .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                                .catch(error => res.status(400).json({ error }));
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })

};

// Affichage d'un post
exports.getPost = (req, res, next) => {
    // Recherche du post séléctionné et triage des commentaires du plus récent au plus ancien
    Post.findOne({
        include: { all: true, nested: true }, where: { post_id: req.params.post_id }, order: [
            [Comment, 'comment_id', 'DESC']
        ]
    })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

// Affichage de tous les posts
exports.getPosts = (req, res, next) => {
    // Recherche des posts et triage de ces derniers du plus récent au plus ancien
    Post.findAll({
        include: { all: true, nested: true }, order: [
            ['post_id', 'DESC']
        ]
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

// Affichage de tous les messages
exports.getPostsMessages = (req, res, next) => {
    // Recherche de tous les messsages et triage de ces derniers du plus récent au plus ancien
    Post.findAll({
        include: { all: true, nested: true }, where:
            { mediaUrl: null }, order: [
                ['post_id', 'DESC']
            ]
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

// Affichage de tous les medias
exports.getPostsMedias = (req, res, next) => {
    // Recherche de tous les medias et triage de ces derniers du plus récent au plus ancien
    Post.findAll({
        include: { all: true, nested: true }, where:
            { content: null }, order: [
                ['post_id', 'DESC']
            ]
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};