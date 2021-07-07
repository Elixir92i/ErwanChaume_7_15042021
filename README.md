# ErwanChaume_7_15042021

###### GROUPOMANIA ######

Pour lancer le projet sur votre machine, clonez le repository et déposez le dans un dossier.

Ensuite créez un fichier .env à la racine du dossier backend avec les variables suivantes:
    HOST=*localhost*
    USER=*Utilisateur SQL*
    PASS=*Mot de passe utilisateur SQL*
    DB=*Nom de la DB*
    JWT=*Clé de cryptage*

Une fois le fichier créé, faites un npm install à la racine du dossier backend et de même dans le dossier frontend.

Une fois fait importer la sauvegarde SQL, cette dernière créera les tables pour l'application ainsi que l'utilisateur admin accessible avec comme e-mail "admin@groupomania.fr" et comme mot de passe "admin".

Ensuite pour démarrer le projet il vous faudra faire un 'ng serve -o' dans un terminal à la racine du frontend et un 'nodemon server' à la racine du backend.

Voilà vous êtes prêt à utiliser le projet !

PS: Si vous souhaiter ajouter un administateur il vous suffit de le faire manuellement dans la base SQL, la valeur admin par défaut est de 0 (false) passez la à 1 (true) et l'utilisateur sera admin !

Projet 7 - OpenClassrooms - Développeur Web
