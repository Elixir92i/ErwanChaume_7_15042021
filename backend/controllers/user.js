// Importation du module bcrypt (cryptage du mot de passe)
const bcrypt = require('bcrypt');
// Importation du modèle de création d'utilisateur
const User = require('../models/User');
// Importation du module JWT (token unique par utilisateur)
const jwt = require('jsonwebtoken');
const mysql = require("sequelize");

const fs = require('fs');
const multer = require('../middleware/multer-config');
const decodeUId = require('../middleware/auth');
const db = require('../utils/database');


// Création d'un utilisateur
exports.signup = (req, res, next) => {
  // Hashage du mot de passe récupéré dans le formulaire d'inscription
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Création d'un nouvel utilisateur dans la base de donnée
      const user = new User({
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
  //.catch(error => res.status(500).json({ error }));
};

// Connexion d'un utilisateur  
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur dans la base de donnée via son email
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      // Erreur si l'utilisateur n'est pas trouvé
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // Comparaison du mot de passe hashé si présent dans la base donnée
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Erreur si le mot de passe diffère
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // Si il correspond envoie du token utilisateur
          res.status(200).json({
            user_id: user.user_id,
            token: jwt.sign(
              { user_id: user.user_id },
              'j0jwkRY1UUwcGmOer6OVlUs-iPpR4lK-IIzgVGXvTsA',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Get one
exports.getUser = (req, res, next) => {
  User.findOne({
    where: { user_id: req.params.user_id },
  }).then(user =>
    res.status(200).json(user))
    .catch(error => res.status(400).json({ error }));
}

// Update
exports.update = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const values = req.file ?
        {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
        } : {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
        };
      var condition = { where: { user_id: req.params.id } }
      var options = { multi: true };

      User.update(values, condition, options)
    })

    .then(Update => {
      /*let user = */User.findOne({ where: { user_id: req.params.id } }
      ).then(user => res.status(200).json((user))
      )
    })
    .catch(error => res.status(400).json({ error }))
}


// Modification d'un utilisateur
/*exports.update = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      //var file = req.file;
      User.findOne({ where: {user_id: req.params.user_id} })
        .then(user => {
          // Suppression de l'image associée dans la base de donnée avant modification
          /*const filename = sauce.imageUrl.split('/images/')[1];
          if (file && filename != file.filename) {
            fs.unlink(`images/${filename}`, () => {
            });
          }
        });*/
          // Recherche de l'image associée
/*const userObject = req.file ?
  {
    // Récupération des informations de la sauce sélectionnée
    ...JSON.parse(req.body.user),
    /*imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };}:*/

          // Mise à jour de l'utilisateur
/*User.updateOne({ _id: req.params.user_id }, { ...userObject, user_id: req.params.user_id })
  .then(() => res.status(200).json({ message: 'User modifiée !' }))
  .catch(error => res.status(400).json({ error }));

})
});
}*/
