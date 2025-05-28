# API de mise en relation Entreprises & Investisseurs

---

## 🎯 1. Contexte

Cette API REST sécurisée, développée avec **NestJS**, **MySQL** et **TypeORM**, permet de mettre en relation des entrepreneurs et des investisseurs.  
Les entrepreneurs peuvent publier leurs projets et les investisseurs peuvent les découvrir, soutenir et investir selon leurs centres d’intérêt.

---

## 🚀 2. Installation & Lancement

### Prérequis

- Node.js >= 16.x  
- MySQL (exemple : WampServer, XAMPP)  
- npm  

### Étapes

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/s-kenza/qvema.git
   cd qvema
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer la base de données**

   * Lancer **MySQL** (via WampServer, XAMPP, ou autre).
   * Créer une base de données avec le nom défini dans .env (ex: DB_NAME).

4. **Configurer les variables d'environnement**

    Créer un fichier .env à la racine avec au minimum :
    *Vous pouvez utiliser le `.env.example` prêt à l'utilisation.*

   ```bash
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES=3600s
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=your_db_name
   ```

5. **Lancer la seed initiale**

   ```bash
   npm run seed:run
   ```

6. **Démarrer l'API**

   ```bash
   npm run start
   ```

---
## ⚙️ 3. Fonctionnalités

### 🧑‍💼 Utilisateurs (Authentification & Gestion)

| Fonctionnalité                               | Route                | Accès       |
|---------------------------------------------|----------------------|-------------|
| Inscription                                 | `POST /auth/register`| Public      |
| Connexion (récupération token JWT)          | `POST /auth/login`   | Public      |
| Consultation profil                         | `GET /users/profile` | Authentifié |
| Mise à jour profil                         | `PUT /users/profile` | Authentifié |
| Liste des utilisateurs                      | `GET /users`         | Admin       |
| Suppression d’un utilisateur                | `DELETE /users/:id`  | Admin       |

- Mot de passe hashé avec bcrypt.
- JWT obligatoire sur toutes les routes sauf inscription et connexion.
- Rôles : `entrepreneur`, `investor`, `admin`.

---

### 🚀 Projets (Création & Consultation)

| Fonctionnalité                             | Route                 | Accès          |
|-------------------------------------------|-----------------------|----------------|
| Création d’un projet                      | `POST /projects`      | Entrepreneur   |
| Consultation de tous les projets          | `GET /projects`       | Authentifié    |
| Consultation d’un projet par ID           | `GET /projects/:id`   | Authentifié    |
| Mise à jour d’un projet                   | `PUT /projects/:id`   | Entrepreneur (créateur) |
| Suppression d’un projet                   | `DELETE /projects/:id`| Entrepreneur (créateur) ou Admin |

- Projet contient : `title`, `description`, `budget`, `category`, `ownerId`.
- Seuls les entrepreneurs peuvent créer et modifier leurs projets.
- Admin peut supprimer n’importe quel projet.

---

### ⛹️ Gestion des centres d’intérêt

| Fonctionnalité                             | Route                   | Accès       |
|-------------------------------------------|-------------------------|-------------|
| Lister tous les intérêts                   | `GET /interests`        | Public      |
| Associer des intérêts à un utilisateur    | `POST /users/interests` | Authentifié |
| Voir les intérêts d’un utilisateur         | `GET /users/interests`  | Authentifié |
| Recommander des projets selon intérêts     | `GET /projects/recommended` | Authentifié |

- Exemples d’intérêts : Technologie, Écologie, Finance, etc.
- Optimisation des recommandations projets selon intérêts.

---

### 💰 Investissements (Gestion des fonds)

| Fonctionnalité                             | Route                          | Accès          |
|-------------------------------------------|--------------------------------|----------------|
| Investir dans un projet                   | `POST /investments`             | Investisseur   |
| Voir ses investissements                  | `GET /investments`              | Investisseur   |
| Voir investissements d’un projet          | `GET /investments/project/:id` | Authentifié    |
| Annuler un investissement                 | `DELETE /investments/:id`       | Investisseur   |

- Investissement : `investorId`, `projectId`, `amount`, `date`.
- Entrepreneurs voient investissements sur leurs projets.

---

### 🛠️ Administration

| Fonctionnalité                             | Route                      | Accès     |
|-------------------------------------------|----------------------------|-----------|
| Voir tous les utilisateurs                 | `GET /admin/users`         | Admin     |
| Supprimer un utilisateur                   | `DELETE /admin/users/:id`  | Admin     |
| Voir toutes les transactions                | `GET /admin/investments`   | Admin     |

- Admins ont contrôle total sur utilisateurs, projets et investissements.

---

## 🔐 3. Sécurité & Rôles

- Authentification via JWT.
- Contrôle des accès via `RolesGuard` et décorateurs `@Roles()`.
- Permissions :
  - **Entrepreneur** : gestion de ses projets.
  - **Investisseur** : voir projets, investir, gérer investissements.
  - **Admin** : gestion complète des utilisateurs, projets, investissements.

---

## 📦 5. Test de l’API avec Postman
Le dossier postman à la racine contient :

- Environnement.postman_environment.json → à importer comme environnement
- Collection.postman_collection.json → à importer comme collection

- Importer ces fichiers dans Postman pour tester toutes les routes facilement.

---

## 📚 6. Liens utiles
- NestJS Documentation
- TypeORM Documentation
- JWT Introduction
- NestJS Guards & Roles

---

## 🏆 7. Résumé
- API REST sécurisée avec JWT
- Gestion des utilisateurs, rôles et permissions
- CRUD complet pour projets et investissements
- Recommandations personnalisées par centres d’intérêt
- Administration complète via rôle admin

---

## 👩‍💻 À propos de l'autrice

Développé par **Kenza SCHULER**, étudiante en M2 Ingénierie du Web à l’ESGI Lyon.
Ce projet s’inscrit dans une démarche d’apprentissage approfondi de l’écosystème **NestJS**, de la gestion des rôles utilisateurs, et de l’implémentation de fonctionnalités métier autour de la mise en relation professionnelle.

💡 **Valeurs du projet** : accessibilité, sécurité, structuration et clarté.

📫 Pour toute question ou collaboration : `kenza.schuler@gmail.com`  
💼 [LinkedIn](www.linkedin.com/in/kenza-schuler-9aa4ab231) • [GitHub](https://github.com/s-kenza)

---

*Merci pour votre lecture, et au plaisir d’échanger autour de vos idées !* 🌱
