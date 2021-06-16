// Importation du module JWT 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header
    const token = req.headers.authorization.split(' ')[1];
    // Vérification du token
    const decodedToken = jwt.verify(token, process.env.JWT);
    res.locals.userId = decodedToken.user_id;
      next();
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};