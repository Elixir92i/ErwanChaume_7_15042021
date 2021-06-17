// Importation des modèles
const Post = require('../models/post');
const User = require('../models/User');
const Comment = require('../models/comment');

// hasMany
User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'cascade', hooks: true });
Comment.belongsTo(User, { foreignKey: 'user_id' });
Post.hasMany(Comment, { foreignKey: 'post_id', onDelete: 'cascade', hooks: true });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

// Créer un commentaire
exports.createComment = (req, res, next) => {
    // Récupération des informations du formulaire de création de commentaire
    const commentObject = req.body;
    const user_id = req.body.user_id;
    const post_id = req.params.post_id;
    // Création dans la base de donnée du message
    const comment = new Comment({
        ...commentObject,
        user_id: user_id,
        post_id: post_id
    });
    comment.save()
        .then(() => res.status(201).json({ message: 'Commentaire publié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprimer un commentaire
exports.deleteComment = (req, res, next) => {
    // Ajout des constantes necessaires
    const user_id = res.locals.userId;
    const post_id = req.params.post_id;
    const comment_id = req.params.comment_id;
    // Vérification de l'utilisateur connecté
    var user = User.findOne({ where: { user_id: user_id } })
        .then(user => {
            var admin = user.admin;
            // Si l'utilisateur est admin
            if (admin === true) {
                // Recherche du commentaire séléctionné
                Comment.findOne({ where: { comment_id: comment_id } })
                    .then(comment => {
                        // Suppression du commentaire
                        Comment.destroy({ where: { comment_id: comment_id } })
                            .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    })
            }
            // Si l'utilisateur n'est pas admin
            else if (admin === false) {
                // Recherche du commentaire séléctionné
                Comment.findOne({ where: { post_id: post_id, user_id: user_id, comment_id: comment_id } })
                    .then(comment => {
                        // Si le commentaire séléctionné ne regroupe pas ces paramètres -> annulation
                        if (comment === null) {
                            res.status(403).json({ "error": "Accès interdit" });
                            return;
                        }
                        // Si "comment" n'est pas "null" suppression du commentaire
                        Comment.destroy({ where: { comment_id: comment_id, post_id: post_id, user_id: user_id } })
                            .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
                            .catch(error => res.status(400).json({ error }));

                    })
                    .catch(error => res.status(500).json({ error }));
            };
        })
};