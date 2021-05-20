// Importation du modèle des messages
const Message = require('../models/postMessage');
const User = require('../models/User');

// hasMany
User.hasMany(Message, {foreignKey: 'user_id'});
Message.belongsTo(User, {foreignKey: 'user_id'});


// Créer un message
exports.createMessage = (req, res, next) => {
    // Récupération des informations du formulaire de création de message
    const messageObject = req.body;
    // Ajout des valeurs like et dislike par défaut = 0
    messageObject.likes = 0;
    messageObject.dislikes = 0;
    // Création dans la base de donnée du message
    const message = new Message({
        ...messageObject
    });
    message.save()
        .then(() => res.status(201).json({ message: 'Message publié !' }))
        .catch(error => res.status(400).json({ error }));
};


// Supprimer un message
exports.deleteMessage = (req, res, next) => {
    // Recherche du message grâce à son ID
    Message.findOne({ message_id: req.params.message_id })
                // Suppression de la message dans la base de donnée
                Message.destroy({ message_id: req.params.message_id })
                    .then(() => res.status(200).json({ message: 'Message supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
};

// Affichage d'une message
exports.getMessage = (req, res, next) => {
    Message.findOne({ message_id: req.params.message_id })
        .then(message => res.status(200).json(message))
        .catch(error => res.status(404).json({ error }));
};

// Affichage de toutes les messages
exports.getMessages = (req, res, next) => {
    Message.find()
        .then(messages => res.status(200).json(messages))
        .catch(error => res.status(400).json({ error }));
};

// Like et dislike d'une message
exports.likeMessage = (req, res, next) => {
    // Ajout des constantes necessaires
    const user_id = req.body.user_id;
    const like = req.body.like;
    const message_id = req.params.message_id;
    // Recherche de la message sélectionnée
    Message.findOne({ message_id: message_id })
        .then(message => {
            // Ajout des variables pour récupérer les infos dans la base de donnée
            let users_liked = message.users_liked;
            let likes = message.likes;
            let users_disliked = message.users_disliked;
            let dislikes = message.dislikes;

            // L'utilisateur like la message
            if (like == 1) {
                // Vérification que l'utilisateur n'a pas déjà like la message
                if (!users_liked.includes(user_id)) {
                    // Si il n'a pas déjà like la message, push de son ID pour l'ajouter à la base de donnée
                    users_liked.push(user_id);
                    // Ajout de son like au compteur
                    likes++;
                }
                // L'utilisateur dislike la message
            } else if (like == -1) {
                // Vérification que l'utilisateur n'a pas déjà dislike la message
                if (!users_disliked.includes(user_id)) {
                    // Si il n'a pas déjà dislike la message, push de son ID pour l'ajouter à la base de donnée
                    users_disliked.push(user_id);
                    // Ajout de son dislike au compteur
                    dislikes++;
                }
                // L'utilisateur retire son like ou son dislike de la message
            } else if (like == 0) {
                // L'utilisateur retire son like de la message
                if (users_liked.includes(user_id)) {
                    // Recherche de l'ID de l'utilisateur dans le tableau des likes (userLiked)
                    var index = users_liked.indexOf(user_id);
                    // Suppression de son ID du tableau des likes (userLiked)
                    users_liked.splice(index, 1);
                    // Retrait de son like au compteur
                    likes--;
                }
                // L'utilisateur retire son dislike de la message
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
            Message.updateOne({ message_id: message_id },
                { dislikes: dislikes, users_disliked: users_disliked, likes: likes, users_liked: users_liked }
            )
                .then(() => res.status(200).json({ message: "L'utilisateur a mis un like ! " }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

}