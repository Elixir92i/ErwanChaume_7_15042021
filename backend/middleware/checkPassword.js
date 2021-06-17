const passwordSchema = require('../models/password');

// Vérification de mot de passe à la création et à l'update
module.exports = (req, res, next) => {
	password = req.body.password;
	// Si le schéma ne correspond pas envoi d'une erreur
	if (!passwordSchema.validate(password)) {
		res.writeHead(
			400,
			'Mot de passe requis : 8 caractères minimun. Au moins 1 majuscule, 1 minuscule, 1 chiffre , un caractère spécial et sans espaces !',
			
		);
		res.end('Format de mot de passe incorrect !');
	} else {
		next();
	}
};