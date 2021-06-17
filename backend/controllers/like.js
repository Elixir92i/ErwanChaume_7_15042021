// Importation des modèles
const Post = require('../models/post');
const User = require('../models/User');
const user = require('./user');
const Like = require('../models/like');

// hasMany
User.hasMany(Like, { foreignKey: 'user_id', onDelete: 'cascade', hooks:true});
Like.belongsTo(User, { foreignKey: 'user_id' });
Post.hasMany(Like, { foreignKey: 'post_id', onDelete: 'cascade', hooks:true});
Like.belongsTo(Post, { foreignKey: 'post_id' });

// Like d'un post
exports.likePost = (req, res, next) => {
    // Ajout des constantes nécessaires
    const user_id = req.body.user_id;
    const post_id = req.params.post_id;
    // Recherche du like sélectionné
    Like.findOne({ where: { post_id: post_id, user_id: user_id } })
        .then(like => {
            // Si le like n'existe pas, envoie dans la base de données
            if (null === like) {
                const post_like = new Like({
                    user_id: user_id,
                    post_id: post_id
                });
                post_like.save()
                    .then(() => res.status(201).json({ message: 'Like créé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            // Si le like existe déjà, suppression dans la base de données
            else {
                Like.destroy({ where: { post_id: post_id, user_id: user_id } })
                        .then(() => res.status(200).json({ message: 'Like supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}