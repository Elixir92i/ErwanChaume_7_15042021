// Importation de sequelize
const Sequelize = require('sequelize')

// Connexion pour la base de données
const sequelize = require('../utils/database')

// Création de la table des likes
const Like = sequelize.define('like', {
    // ID des likes
    like_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }, 
})
module.exports = Like;