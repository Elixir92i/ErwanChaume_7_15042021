// Vérification du nom/prénom
exports.checkName = (req, res, next) => {
    const regex = /^[\p{L}\p{Mn}\p{Pd}]+(?:\s[\p{L}\p{Mn}\p{Pd}]+)*$/u
    const lastname = req.body.lastname;
    const firstname = req.body.firstname;
	// Si le schéma n'est pas valide envoi d'une erreur
	if (!regex.test(lastname) || !regex.test(firstname) ) {
		res.writeHead(
			400,
			'Nom ou prénom invalide !'
		);
		res.end('Format de nom ou prénom incorrect !');
	} else {
		next();
	}
};

// Vérification du mail
exports.checkMail = (req, res, next) => {
    const regexMail = /[A-Za-z0-9_'~-]+(?:\.[A-Za-z0-9_'~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[a-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/g;
    const email = req.body.email;
	// Si le schéma n'est pas valide envoi d'une erreur
	if (!regexMail.test(email)) {
		res.writeHead(
			400,
			`Format de l'email invalide !`
		);
		res.end('Format du mail incorrect !');
	} else {
		next();
	}
};