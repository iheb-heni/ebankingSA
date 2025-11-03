# Projet e-banking — Documentation rapide

Cette documentation rapide fournit un aperçu du projet, comment le construire et l'exécuter localement, où se trouvent les points d'entrée et les fichiers de configuration importants.

## Aperçu
- Nom du projet : e-banking
- Backend : Spring Boot (Java 21, Spring Boot 3.5.6)
- Frontend : Angular (v20)
- Base de données : MySQL (production), H2 en tests

## Structure principale (extraits)
- Backend Java : `src/main/java/com/example/ebanking/` (classes Spring Boot, contrôleurs, services, repositories)
- Config Spring : `src/main/resources/application.properties`, `src/main/resources/application-test.properties`
- Frontend Angular : `ebanking-frontend/` (app, assets, environments, package.json)
- Script/base SQL : `ebanking_db.sql`

## Fichiers importants
- `pom.xml` : dépendances et build Maven
- `ebanking-frontend/package.json` : scripts npm et dépendances Angular
- `ebanking-frontend/src/environments/environment.ts` : URL API par défaut pour le dev
- `src/main/resources/application.properties` : configuration DB, JWT, port (server.port=8000)

## Variables et paramètres clés
- API front -> backend (dev) : `http://localhost:8000/api` (défini dans `ebanking-frontend/src/environments/environment.ts`)
- DB (dev/prod) : `spring.datasource.url` dans `application.properties` (ex. `jdbc:mysql://localhost:3306/ebanking_db`)
- JWT : `jwt.secret` et `jwt.expiration` dans `application.properties`

## Comment lancer le projet (Windows / PowerShell)
Remarques : Ce dépôt contient un wrapper Maven (`mvnw.cmd`) et un frontend Angular.

Backend (Spring Boot)
- Installer Java 21 sur la machine.
- Construire et lancer :
  .\mvnw.cmd clean package
  .\mvnw.cmd spring-boot:run
- Ou simplement exécuter le jar généré :
  java -jar target\e-banking-1.0.0.jar
- Exécuter les tests :
  .\mvnw.cmd test

Frontend (Angular)
- Aller dans le dossier frontend :
  cd ebanking-frontend
- Installer dépendances :
  npm ci
- Lancer en développement (serve) :
  npm start
  (par défaut, Angular sert sur http://localhost:4200)
- Construire pour production :
  npm run build
- Tests :
  npm test

## Base de données
- Fichier SQL fourni : `ebanking_db.sql` (crée les tables et données initiales).
- Par défaut, `application.properties` pointe vers :
  jdbc:mysql://localhost:3306/ebanking_db
- Assurez-vous que l'utilisateur et le mot de passe sont corrects dans `application.properties` ou définissez des variables d'environnement / profiles Spring pour la prod.

## Points d'entrée et routage (rapide)
- Application Spring Boot principale : chercher la classe annotée `@SpringBootApplication` dans `src/main/java/com/example/ebanking`
- Contrôleurs REST : packages `controller` ou `web` (recherche `@RestController`)
- Composants Angular principaux : `ebanking-frontend/src/app/pages/` (login, register, dashboard)

## Tests et CI
- Backend : `mvn test` (utilise H2 in-memory pour `application-test.properties`)
- Frontend : `npm test` (Karma/Jasmine)

## Conseils d'utilisation et notes
- JWT secret est présent dans `application.properties` ; changez-le pour la production et ne le mettez pas en repo.
- `spring.jpa.hibernate.ddl-auto=none` (ne pas laisser `create`/`update` en production sans contrôle)
- Pour debugging rapide des tests, l'application de test utilise H2 en mémoire (`application-test.properties`).

## Fichiers à vérifier en priorité
- `pom.xml` — versions Java / dépendances
- `src/main/resources/application.properties` — DB, JWT, server.port
- `ebanking-frontend/src/environments/environment.ts` — apiUrl

## Prochaines améliorations possibles
- Ajouter un `README.md` à la racine avec un résumé et commandes rapides (je peux l'ajouter).
- Ajouter un `docker-compose` pour démarrer MySQL + backend + frontend pour dev.
- Externaliser les secrets (JWT, DB) via variables d'environnement ou vault.

---
Généré automatiquement : actions réalisées — scan initial des fichiers `pom.xml`, `ebanking-frontend/package.json`, `application.properties` et `environment.ts`.

Si tu veux, je peux :
- Générer un `README.md` à la racine avec commandes rapides.
- Ajouter un `Makefile`/scripts PowerShell pour lancer tout le stack en une commande.
- Exécuter les tests backend/frontend et rapporter les résultats.

Dis-moi la suite que tu préfères.

## Endpoints découverts (scan rapide)

- Authentification (backend) — `src/main/java/com/example/ebanking/controller/AuthController.java` :
  - POST /api/auth/login -> Authentifie l'utilisateur (attend `LoginRequest`). Retourne JWT et user info.
  - POST /api/auth/register -> Enregistre l'utilisateur puis renvoie un token (méthode `registerAndLoginUser`).
  - POST /api/auth/register-old -> Ancienne route d'enregistrement (registre sans connexion automatique).
  - POST /api/auth/logout -> Déconnecte l'utilisateur (côté serveur) et le client nettoie le token.

- Dashboard / Account controllers : présents comme stubs (`DashboardController`, `AccountController`) — pas (encore) d'implémentation publique dans le code source.

## Intégration frontend-backend (auth)
- Frontend utilise `AuthService` (`ebanking-frontend/src/app/services/auth.service.ts`) :
  - Appelle `${environment.apiUrl}/auth/login` et `${environment.apiUrl}/auth/register`.
  - Sur succès, stocke `token` dans `localStorage` et `currentUser`.
  - Un interceptor (`ebanking-frontend/src/app/interceptors/jwt.interceptor.ts`) attache automatiquement `Authorization: Bearer <token>` aux requêtes HTTP sortantes.

## Statut actuel et recommandations rapides
- Routes d'auth existantes : OK pour tests locaux.
- Ajouter des contrôleurs et endpoints REST pour la gestion des comptes si nécessaire (les stubs existent déjà).
- S'assurer que `jwt.secret` n'est pas commit en production; utiliser des variables d'environnement / profiles.

---
Fin de la mise à jour automatique.