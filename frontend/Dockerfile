# Utiliser une image officielle de Node.js comme image de base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application Vue.js
RUN npm run build

# Installer un serveur HTTP pour servir les fichiers statiques
RUN npm install -g serve

# Exposer le port sur lequel l'application écoute
EXPOSE 8080

# Démarrer l'application
CMD ["serve", "-s", "dist", "-l", "8080"]