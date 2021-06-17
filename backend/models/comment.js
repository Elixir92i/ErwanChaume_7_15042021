// Importation de sequelize
const Sequelize = require('sequelize')

// Connexion pour la base de données
const sequelize = require('../utils/database')

// Création de la table des commentaires
const Comment = sequelize.define('comment', {
    // ID des commentaires
    comment_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
  
    // Contenu du commentaire
    commentContent: {type: Sequelize.STRING, allowNull: false},
    
    // Date du commentaire
    myDate: { type: Sequelize.DATE, 
            defaultValue: Sequelize.NOW },
  
     // Timestamps
     createdAt: Sequelize.DATE,
})
module.exports = Comment;