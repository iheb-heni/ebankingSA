# e-banking — Quickstart

Documentation complète : voir `docs/PROJECT_DOCUMENTATION.md`.

Raccourcis de développement (Windows / PowerShell):

Backend (Spring Boot)

- Construire :
```
.\mvnw.cmd clean package
```
- Lancer :
```
.\mvnw.cmd spring-boot:run
```
- Lancer les tests :
```
.\mvnw.cmd test
```

Frontend (Angular)

- Aller dans le dossier frontend :
```
cd ebanking-frontend
```
- Installer dépendances :
```
npm ci
```
- Lancer le serveur dev :
```
npm start
```
- Tests frontend :
```
npm test
```

Notes rapides

- API dev : `http://localhost:8000/api` (référencé dans `ebanking-frontend/src/environments/environment.ts`).
- DB : vérifier `src/main/resources/application.properties` et le fichier `ebanking_db.sql`.

Pour plus de détails, consulte la documentation dans `docs/PROJECT_DOCUMENTATION.md`.