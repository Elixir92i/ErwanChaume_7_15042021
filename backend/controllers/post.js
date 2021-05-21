// Importation du modèle des medias
const Post = require('../models/post');
const User = require('../models/User');
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
    Post.findOne({ where: { post_id: req.params.post_id }, include: User })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

// Affichage de tous les posts
exports.getPosts = (req, res, next) => {
    Post.findAll({ include: User })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

// Like et dislike d'une post
exports.likePost = (req, res, next) => {
    // Ajout des constantes necessaires
    const user_id = req.body.user_id;
    const like = req.body.like;
    const post_id = req.params.post_id;
    // Recherche de la media sélectionnée
    Post.findOne({ where: { post_id: post_id } })
        .then(post => {
            // Ajout des variables pour récupérer les infos dans la base de donnée
            let users_liked = post.users_liked;
            let likes = post.likes;
            let users_disliked = post.users_disliked;
            let dislikes = post.dislikes;

            // L'utilisateur like la media
            if (like == 1) {
                // Vérification que l'utilisateur n'a pas déjà like la media
                if (!users_liked.includes(user_id)) {
                    // Si il n'a pas déjà like la media, push de son ID pour l'ajouter à la base de donnée
                    users_liked.push(user_id);
                    // Ajout de son like au compteur
                    likes++;
                }
                // L'utilisateur dislike la media
            } else if (like == -1) {
                // Vérification que l'utilisateur n'a pas déjà dislike la media
                if (!users_disliked.includes(user_id)) {
                    // Si il n'a pas déjà dislike la media, push de son ID pour l'ajouter à la base de donnée
                    users_disliked.push(user_id);
                    // Ajout de son dislike au compteur
                    dislikes++;
                }
                // L'utilisateur retire son like ou son dislike de la media
            } else if (like == 0) {
                // L'utilisateur retire son like de la media
                if (users_liked.includes(user_id)) {
                    // Recherche de l'ID de l'utilisateur dans le tableau des likes (userLiked)
                    var index = users_liked.indexOf(user_id);
                    // Suppression de son ID du tableau des likes (userLiked)
                    users_liked.splice(index, 1);
                    // Retrait de son like au compteur
                    likes--;
                }
                // L'utilisateur retire son dislike de la media
                if (users_disliked.includes(user_id)) {
                    // Recherche de l'ID de l'utilisateur dans le tableau des dislikes (userDisliked)
                    var index = users_disliked.indexOf(user_id);
                    // Suppression de son ID du tableau des dislikes (userDisliked)
                    users_disliked.splice(index, 1);
                    // Retrait de son dislike au compteur
                    dislikes--;
                }
            }
            // Mise à jour des champs nécessaires pour les likes et dislike
            Post.updateOne({ where: { post_id: post_id } },
                { dislikes: dislikes, users_disliked: users_disliked, likes: likes, users_liked: users_liked }
            )
                .then(() => res.status(200).json({ message: "L'utilisateur a mis un like ! " }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

}