// Importation du module JWT 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header
    const token = req.headers.authorization.split(' ')[1];
    // Vérification du token
    const decodedToken = jwt.verify(token, 'j0jwkRY1UUwcGmOer6OVlUs-iPpR4lK-IIzgVGXvTsA');
    const userId = decodedToken.userId;
    // Vérification de l'ID de l'utilisateur
    if (req.body.userId && req.body.userId !== userId) {
      // Erreur si il n'est pas exact
      throw 'Invalid user ID';
      // Accès à la page si exact
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};