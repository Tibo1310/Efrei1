# frontend

## Project setup
```
npm install
```
### Compiles and minifies for production
```
npm run build
```

### FRONTEND (bien se mettre sur le dossier frontend)
```
npm run serve
```

### BACKEND (bien se mettre sur le dossier principal du projet)
```
node server.js
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

##
Lancer front front VueJS: npm run serve
Pour aller sur le site (front) : http://localhost:8080

Lancer serveur node: node server.js
Pour voir tous les items : http://localhost:5000/items

Database : MongoDB Compass > localhost:27017/EFREI_Projet 
- Collections : users, items, posts, activities

## Nom du projet : Spella

##
Description : Spella est une application web type "Twitter" qui a pour but de permettre aux utilisateurs de partager des tutoriels interactifs et conseils pour apprendre une nouvelle langue, pour tous les niveaux.

## Techno utilisées :

Vue.js : front => interfaces utilisateur.
Vue Router : routeur
Vuex : gestionnaire d'état
Bootstrap : framework front
Font Awesome : icônes vectorielles
Node.js : backend => environnement d'exécution JS
Express : framework web Node.js
Mongoose : ODM MongoDB / Node.js.
MongoDB : BDD NoSQL
JWT : authentification / gestion sessions utilisateur.
Multer : middleware pour téléchargements de fichiers (ici custom icons)
Bcrypt.js : hacher les mots de passe avant de les stocker dans la bdd
Cypress : tests end-to-end.
Jest : tests unitaires.
GitHub Actions : intégration continue / déploiement continu CI/CD