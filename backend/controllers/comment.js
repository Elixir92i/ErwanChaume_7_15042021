// Importation du modèle des medias
const Post = require('../models/post');
const User = require('../models/User');
const Comment = require('../models/comment');

// hasMany
Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// Créer un message
exports.createComment = (req, res, next) => {
    // Récupération des informations du formulaire de création de message
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

// Supprimer un media
exports.deleteComment = (req, res, next) => {
    // Recherche de la media grâce à son ID
    const user_id = req.body.user_id;
    const post_id = req.params.post_id;
    const comment_id = req.params.comment_id;
    Comment.findOne({ where: { post_id: post_id, user_id: user_id, comment_id: comment_id } })
        .then(comment => {   
                Comment.destroy({ where: { post_id: post_id, user_id: user_id, comment_id: comment_id } })
                        .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
            
        })
        .catch(error => res.status(500).json({ error }));
};