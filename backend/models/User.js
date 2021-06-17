// Importation de sequelize
const Sequelize = require('sequelize')
  
// Connexion pour la base de données
const sequelize = require('../utils/database')

// Ajout de l'image par défaut
const defaultProfile = ('http://localhost:3000/images/default.png');
  
// Création de la table des users
const User = sequelize.define('user', {
    // ID des users
    user_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
  
    // Prénom de l'utilisateur
    firstname: { type: Sequelize.STRING, allowNull:false },
    // Nom de l'utilisateur
    lastname: { type: Sequelize.STRING, allowNull:false },
    // Image de l'utilisateur (par défaut)
    imageUrl: { type: Sequelize.STRING, defaultValue: defaultProfile },
    // Email de l'utilisateur
    email: { type: Sequelize.STRING, allowNull:false, unique: true },
    // Mot de passe de l'utilisateur
    password: { type: Sequelize.STRING, allowNull:false },
    // Grade de l'utilisateur (admin ou pas)
    admin: { type : Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    // Date de création de l'utilisateur
    myDate: { type: Sequelize.DATE, 
            defaultValue: Sequelize.NOW },
  
     // Timestamps
     createdAt: Sequelize.DATE,
     updatedAt: Sequelize.DATE,
})
module.exports = User;