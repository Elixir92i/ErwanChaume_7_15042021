const passwordSchema = require('../models/password');

// La vérification de mot de passe à la création
module.exports = (req, res, next) => {
	password = req.body.password;
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