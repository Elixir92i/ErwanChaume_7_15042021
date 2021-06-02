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

// Like d'un post
exports.likePost = (req, res, next) => {
    // Ajout des constantes nécessaires
    const user_id = req.body.user_id;
    const post_id = req.params.post_id;

    // Recherche du post sélectionnée pour le like
    Like.findOne({ where: { post_id: post_id, user_id: user_id } })
        .then(like => {
            if (null === like) {
                const post_like = new Like({
                    user_id: user_id,
                    post_id: post_id
                });
                post_like.save()
                    .then(() => res.status(201).json({ message: 'Like créé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            else {
                Like.destroy({ where: { post_id: post_id, user_id: user_id } })
                        .then(() => res.status(200).json({ message: 'Like supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}