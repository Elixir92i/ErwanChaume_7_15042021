// Importation du modèle des medias
const Media = require('../models/postMedia');
const User = require('../models/User');
// Importation du module fs 
const fs = require('fs');

// hasMany
User.hasMany(Media, {foreignKey: 'user_id'});
Media.belongsTo(User, {foreignKey: 'user_id'});

// Créer une media
exports.createMedia = (req, res, next) => {
    // Récupération des informations du formulaire de création de media
    const mediaObject = JSON.parse(req.body.media);
    // Ajout des valeurs like et dislike par défaut = 0
    mediaObject.likes = 0;
    mediaObject.dislikes = 0;
    // Création dans la base de donnée de la media avec l'image associée au mediaObject
    const media = new Media({
        ...mediaObject,
        mediaUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    media.save()
        .then(() => res.status(201).json({ message: 'Media publié !' }))
        .catch(error => res.status(400).json({ error }));
};


// Supprimer une media
exports.deleteMedia = (req, res, next) => {
    // Recherche de la media grâce à son ID
    Media.findOne({ media_id: req.params.media_id })
        .then(media => {
            // Suppression de l'image associée dans la base de donnée
            const filename = media.mediaUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Suppression de la media dans la base de donnée
                Media.destroy({ media_id: req.params.media_id })
                    .then(() => res.status(200).json({ message: 'Media supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Affichage d'une media
exports.getMedia = (req, res, next) => {
    Media.findOne({ media_id: req.params.media_id })
        .then(media => res.status(200).json(media))
        .catch(error => res.status(404).json({ error }));
};

// Affichage de toutes les medias
exports.getMedias = (req, res, next) => {
    Media.find()
        .then(medias => res.status(200).json(medias))
        .catch(error => res.status(400).json({ error }));
};

// Like et dislike d'une media
exports.likeMedia = (req, res, next) => {
    // Ajout des constantes necessaires
    const user_id = req.body.user_id;
    const like = req.body.like;
    const media_id = req.params.media_id;
    // Recherche de la media sélectionnée
    Media.findOne({ media_id: media_id })
        .then(media => {
            // Ajout des variables pour récupérer les infos dans la base de donnée
            let users_liked = media.users_liked;
            let likes = media.likes;
            let users_disliked = media.users_disliked;
            let dislikes = media.dislikes;

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
            Media.updateOne({ media_id: media_id },
                { dislikes: dislikes, users_disliked: users_disliked, likes: likes, users_liked: users_liked }
            )
                .then(() => res.status(200).json({ message: "L'utilisateur a mis un like ! " }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

}