// Importation du modèle des medias
const Post = require('../models/post');
const User = require('../models/User');
const user = require('./user');
const Like = require('../models/like');

// hasMany
User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });
Post.hasMany(Like, { foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

// Like et dislike d'une post
exports.likePost = (req, res, next) => {
    // Ajout des constantes necessaires
    const user_id = req.body.user_id;
    const req_like = req.body.like;
    const post_id = req.params.post_id;
    // Recherche de la media sélectionnée
    //Post.findOne({ where: { post_id: post_id } })
        //.then(like => {
            if (!Like.includes(user_id)) {
                const post_like = new Like({
                    user_id: user_id,
                    post_id: post_id
                });
                post_like.save()
                    .then(() => res.status(201).json({ message: 'Like créé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            else {
                return;
            }
        //})
        //.catch(error => res.status(500).json({ error }));
}

            // Ajout des variables pour récupérer les infos dans la base de donnée
            //let users_liked = like.user_id;
            //let likes = post.likes;
            //let users_disliked = post.users_disliked;
            //let dislikes = post.dislikes;

            // L'utilisateur like la media
/*if (like == 1) {
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
Post.updateOne({ where: { post_id: req.params.post_id } },
    { dislikes: dislikes, users_disliked: users_disliked, likes: likes, users_liked: users_liked }
)
    .then(() => res.status(200).json({ message: "L'utilisateur a mis un like ! " }))
    .catch(error => res.status(400).json({ error }));*/

