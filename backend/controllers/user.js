// Importation du module bcrypt (cryptage du mot de passe)
const bcrypt = require('bcrypt');
// Importation du modèle de création d'utilisateur
const User = require('../models/User');
// Importation du module JWT (token unique par utilisateur)
const jwt = require('jsonwebtoken');

// Importation de fs
const fs = require('fs');

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
        lastname: req.body.lastname,
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
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
              process.env.JWT,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Recherche d'un utilisateur
exports.getUser = (req, res, next) => {
  const user_id = res.locals.userId;
  // Recherche via le user_id
  User.findOne({
    include: { all: true, nested: true },
    where: { user_id: user_id },
  }).then(user => {
    // Si le user_id est différent de celui dans la barre de recherche -> annulation
    if (user_id != req.params.user_id) {
      res.status(403).json({ "error": "Accès interdit" });
      return;
    }
    // Si le user_id correspond envoie de l'objet user
    res.status(200).json(user)
      .catch(error => res.status(400).json({ error }));
  })
    .catch(error => res.status(500).json({ error }));
};

// Mise à jour du mot de passe
exports.updatePassword = (req, res, next) => {
  const user_id = res.locals.userId;
  // Hashage du mot de passe récupéré dans le formulaire d'update
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      let file = req.file;
      // Recherche de l'utilisateur
      User.findOne({
        where: { user_id: user_id },
      })
        .then(user => {
          // Si le user_id est différent de celui dans la barre de recherche -> annulation
          if (user_id != req.params.user_id) {
            res.status(403).json({ "error": "Accès interdit" });
            return;
          }
          // Récupération des valeurs
          const values = req.file ?
            {
              password: hash,
            } : {
              password: hash,
            };
          var condition = { where: { user_id: req.params.user_id } }
          var options = { multi: true };
          // Mise à jour du mot de passe de l'utilisateur
          User.update(values, condition, options)
        })
        .catch(error => res.status(400).json({ error }))

        .then(response => {
          let user = User.findOne({ where: { user_id: req.params.user_id } })
            .then(user => res.status(200).json((user)))
        })
        .catch(error => res.status(400).json({ error }))
        .catch(error => res.status(400).json({ error }))
    });
}

// Mise à jour du profil
exports.update = (req, res, next) => {
  const user_id = res.locals.userId;
  let file = req.file;
  // Recherche de l'utilisateur
  User.findOne({
    where: { user_id: user_id },
  })
    .then(user => {
      // Si le user_id est différent de celui dans la barre de recherche -> annulation
      if (user_id != req.params.user_id) {
        res.status(403).json({ "error": "Accès interdit" });
        return;
      }
      // Déclaration des constantes nécéssaires
      const filename = user.imageUrl.split('/images/')[1];
      const defaultFile = user.imageUrl;
      const defaultImage = 'http://localhost:3000/images/default.png';
      // Si l'image de l'utilisateur est celle par défaut
      if (defaultFile == defaultImage) {
        // Récupération des valeurs 
        const values = req.file ?
          {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          } : {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
          };
        var condition = { where: { user_id: req.params.user_id } }
        var options = { multi: true };
        // Mise à jour de l'utilisateur
        User.update(values, condition, options)
      }
      // Si l'image de l'utilisateur est différente de celle par défaut
      else if (file && filename != file.filename) {
        // Suppression de son ancienne image stockée dans le projet
        fs.unlink(`images/${filename}`, () => {
        })
      }
      // Récupération des valeurs
      const values = req.file ?
        {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
        };
      var condition = { where: { user_id: req.params.user_id } }
      var options = { multi: true };
      // Mise à jour de l'utilisateur
      User.update(values, condition, options)
    })
    .catch(error => res.status(400).json({ error }))

    .then(response => {
      let user = User.findOne({ where: { user_id: req.params.user_id } })
        .then(user => res.status(200).json((user)))
    })
    .catch(error => res.status(400).json({ error }))
    .catch(error => res.status(400).json({ error }))
};

// Supprimer un utilisateur
exports.delete = (req, res, next) => {
  const user_id = res.locals.userId;
  // Recherche de l'utilisateur grâce à son ID
  User.findOne({ where: { user_id: user_id } })
    .then(user => {
      if (user_id != req.params.user_id) {
        res.status(403).json({ "error": "Accès interdit" });
        return;
      }
      // Suppression de l'image associée dans la base de donnée
      const filename = user.imageUrl.split('/images/')[1];
      const defaultFile = user.imageUrl;
      const defaultDelImage = 'http://localhost:3000/images/default.png';
      if (defaultFile != defaultDelImage) {
        fs.unlink(`images/${filename}`, () => {
        })
      }
    })
  // Suppression de l'utilisateur dans la base de donnée
  User.destroy({ where: { user_id: req.params.user_id } })
    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};

