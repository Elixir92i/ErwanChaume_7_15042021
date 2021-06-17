// Modèle du password-validator

let passwordValidator = require('password-validator');
 
// Creation de la variable passwordSchema
let passwordSchema = new passwordValidator();
 
// Ajout des propriétées 
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
 
// Get a full list of rules which failed
console.log(passwordSchema.validate('joke', { list: true }));
// => [ 'min', 'uppercase', 'digits' ]

module.exports = passwordSchema;