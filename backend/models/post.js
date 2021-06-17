// Importation de sequelize
const Sequelize = require('sequelize')
  
// Connexion pour la base de données
const sequelize = require('../utils/database')

// Création de la table des posts
const Post = sequelize.define('post', {
    // ID des posts
    post_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
  
    // Titre du post
    title: { type: Sequelize.STRING, allowNull:false },
    // Image du post (média)
    mediaUrl: { type: Sequelize.STRING, allowNull:true },
    // Contenu du post (message)
    content: { type: Sequelize.TEXT, allowNull: true },
    
    
    // Date du commentaire
    myDate: { type: Sequelize.DATE, 
            defaultValue: Sequelize.NOW },
  
     // Timestamps
     createdAt: Sequelize.DATE,
     updatedAt: Sequelize.DATE,
})
module.exports = Post;