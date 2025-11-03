# SECURITY CHECKLIST — e-banking

Ce document fournit une checklist actionable et réglages recommandés pour sécuriser l'application e-banking (backend Spring Boot, frontend Angular, infra, CI/CD). Place ce fichier dans `docs/` et utilise-le comme guide de revue de sécurité.

## Résumé rapide
- Type de projet : Spring Boot (Java 21) backend + Angular (v20) frontend
- DB : MySQL (prod), H2 en tests
- Port backend dev : 8000
- API frontend -> backend : `http://localhost:8000/api` (dev)

## Comment utiliser cette checklist
- Chaque item comporte : recommandation, pointer vers fichier/lieu dans le repo, et actions vérifiables.
- Coche les cases au fur et à mesure, documente la preuve (commandes, captures d'écran, logs) dans la colonne `preuve` si possible.

---

## Checklist critique (À faire immédiatement)
- [ ] Secrets hors du repo
  - Recommandation : retirer `jwt.secret` et autres secrets du fichier `src/main/resources/application.properties`. Utiliser variables d'environnement ou mécanismes secrets (Vault, Azure Key Vault, AWS Secrets Manager).
  - Fichiers : `src/main/resources/application.properties`
  - Vérification : absence de `jwt.secret` en clair dans le repo. Commande : `git grep "jwt.secret"`.
  - Preuve :

- [ ] Forcer HTTPS (dev/prod)
  - Recommandation : configurer TLS en prod (reverse proxy / ingress / Spring Boot SSL). Ajouter redirection HTTP -> HTTPS et HSTS.
  - Exemple (Spring Boot) : configurer `server.ssl.*` via variables d'env et activer `server.http-to-https-redirect` au niveau reverse-proxy.
  - Vérification : site accessible via HTTPS, en-têtes HSTS présents.

- [ ] Sécuriser les credentials DB
  - Recommandation : ne pas committer `spring.datasource.username/password`. Utiliser des variables d'environnement dans `application.properties` :
    spring.datasource.username=${DB_USER}
    spring.datasource.password=${DB_PASS}
  - Vérification : `git grep "datasource.password"` et s'assurer qu'il n'y a pas de mot de passe en clair.

- [ ] Restreindre les permissions DB
  - Recommandation : l'utilisateur MySQL utilisé par l'app doit avoir uniquement les permissions nécessaires (SELECT, INSERT, UPDATE, DELETE sur la DB applicative), pas de droits administrateur.
  - Vérification : revue des comptes DB et permissions.

- [ ] Corriger l'erreur OneDrive/node_modules (dev)
  - Recommandation : déplacer le projet hors de OneDrive ou exclure `node_modules` du sync; sinon, exécuter npm comme admin et fermer les programmes qui verrouillent les fichiers.
  - Vérification : `npm ci` réussit dans `ebanking-frontend`.

---

## Backend — Spring Boot
- [ ] Authentification & JWT
  - Recommandation :
    - Stocker la clé JWT dans un secret manager / variable d'environnement.
    - Utiliser une clé suffisamment longue et la rotation planifiée.
    - Signer les tokens avec HS256/RS256 (privilégier RS256 si possible pour séparation clé publique/privée).
  - Fichier : `src/main/resources/application.properties` (actuellement contient `jwt.secret`)
  - Vérification : s'assurer que `AuthService` / `JwtUtils` utilisent le secret depuis env.

- [ ] Password hashing
  - Recommandation : utiliser BCrypt (Spring Security `BCryptPasswordEncoder`) ou autre algorithme moderne et ajuster cost
esspecially for production.
  - Vérification : recherche d'utilisation de `BCryptPasswordEncoder` ou autre dans le code.

- [ ] Configuration Spring Security
  - Recommandation :
    - Définir une `SecurityFilterChain` clairement.
    - Désactiver les endpoints sensibles par défaut.
    - CSRF : pour API REST stateless (JWT) CSRF peut être désactivé mais seulement si applicatif stateless et CORS bien mis.
    - CORS : autoriser explicitement les origines (éviter `*` en prod).
  - Fichier à vérifier : classes de config sous `src/main/java/.../config` ou `security`.
  - Vérification : tests d'intrusion, scans OpenAPI pour endpoints exposés.

- [ ] Input validation et prévention des injections
  - Recommandation : valider toutes les entrées côté backend (Jakarta Validation), éviter la concaténation SQL (utiliser JPA/Hibernate avec requêtes paramétrées), limiter tailles d'input.
  - Fichiers : DTOs (`src/main/java/com/example/ebanking/dto`), entités.
  - Vérification : revue statique + tests.

- [ ] Sécuriser les entêtes HTTP
  - Recommandation : configurer Content-Security-Policy (si rendu HTML), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Strict-Transport-Security via Spring Security headers.
  - Vérification : curl -I https://... pour voir les headers.

- [ ] Limitation de débit / protection brute-force
  - Recommandation : ajouter rate-limiting (e.g., Bucket4j) sur endpoints sensibles (/api/auth/login) et captchas si besoin.
  - Vérification : test d'attaque simulée ou scripts de charge.

- [ ] Logging/Audit
  - Recommandation : centraliser logs (ELK/EFK) et ne pas logguer de secrets (passwords/jwt secrets). Activer audit pour opérations sensibles.
  - Vérification : revue des logs et suppression d'éventuels secrets.

- [ ] Tests de sécurité automatisés
  - Recommandation : intégrer SAST (SpotBugs + FindSecBugs, SonarQube) et DAST (OWASP ZAP) dans CI.
  - Vérification : rapport SAST/DAST dans pipeline CI.

---

## Frontend — Angular
- [ ] Protection des tokens
  - Recommandation : stocker access token dans mémoire (si possible) ou dans `localStorage`/`sessionStorage` en connaissance de cause. Éviter cookies non sécurisés. Utiliser HttpOnly cookies si côté serveur peut en gérer.
  - Notes : le projet utilise `localStorage` (voir `AuthService`). C'est acceptable mais vulnérable au XSS. Prendre mesures pour réduire XSS (CSP + sanitizer).
  - Vérification : revue de `AuthService` et `jwt.interceptor.ts`.

- [ ] Prévention XSS
  - Recommandation : appliquer Content Security Policy côté serveur (ou meta tag), utiliser Angular sanitizer et ne pas binder du HTML non-sanitizé.
  - Vérification : tests manuels et outils d'analyse (DOMPurify, Angular sanitizer audit).

- [ ] Sécuriser build chain et dépendances
  - Recommandation :
    - activer `npm audit` régulièrement
    - configurer Dependabot ou Renovate
    - vérifier `devDependencies` (Karma builder manquant peut indiquer incompatibilité)
  - Vérification : `npm audit --audit-level=high` et corriger les vulnérabilités.

- [ ] CORS et origines autorisées
  - Recommandation : backend doit limiter les origines autorisées en prod (ne pas laisser `@CrossOrigin(origins = "*")`).
  - Vérification : revue des annotations `@CrossOrigin` (e.g., `AuthController` a `origins = "*"` — restreindre en prod).

---

## Infrastructure & Déploiement
- [ ] CI/CD secrets & permissions
  - Recommandation : utiliser secrets CI (GitHub Actions secrets, GitLab CI variables), ne pas stocker tokens dans le repo.
  - Vérification : s'assurer que pipeline CI n'expose pas secrets dans logs.

- [ ] Docker & container security
  - Recommandation :
    - utiliser non-root user dans conteneurs
    - scanner images (Trivy)
    - minimiser la surface en utilisant images JRE/JDK minimales
  - Vérification : scan images, revue Dockerfile.

- [ ] Backup & DR pour DB
  - Recommandation : mettre en place sauvegardes régulières et test de restauration.
  - Vérification : procédure de backup testée.

---

## Dépendances & supply chain
- [ ] Dépendances Java
  - Recommandation : maintenir à jour et scanner (dependabot, OWASP dependency-check, mvn versions plugin).
  - Vérification : `mvn dependency:tree` et `mvn -Drevision check` ou config Dependabot.

- [ ] Dépendances JS
  - Recommandation : activer `npm audit`, automerger patch si sûr, utiliser lockfiles.
  - Vérification : `npm ci` passe et `npm audit` retournent 0 high/critical.

---

## Tests de sécurité recommandés
- SAST : SpotBugs + FindSecBugs, SonarQube
- DAST : OWASP ZAP scan automatisé contre l'API/Frontend
- Dependency scanning : OWASP Dependency-Check, npm audit, Trivy (images)
- Pentest : 3rd party pentest périodique

---

## Commandes et snippets pratiques
- Rechercher secrets en clair :

```bash
# depuis la racine du repo
git grep -n "secret\|password\|jwt.secret" || true
```

- Vérifier dépendances Java :

```bash
cd <repo-root>
.\mvnw.cmd dependency:tree -Dincludes=io.jsonwebtoken,junit
```

- Vérifier vulnérabilités npm :

```powershell
cd ebanking-frontend
npm ci
npm audit --audit-level=high
```

- Lancer OWASP ZAP quick scan (exemple) :
  - Déployer l'app sur env de test, lancer ZAP scan contre l'URL.

---

## Remédiations rapides prioritaires (actions suggérées)
1. Retirer `jwt.secret` du repo et le charger depuis variable d'environnement (urgent).
2. Restreindre `@CrossOrigin(origins = "*")` pour les controllers en prod.
3. Déplacer le projet hors de OneDrive ou exclure `node_modules` du sync pour éviter problèmes de build/dev.
4. Activer SAST/DAST dans CI et ajoute un job `security-scan`.
5. Configurer HTTPS/TLS en prod et sécuriser les en-têtes HTTP.

---

## Annexes & ressources
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP ZAP: https://www.zaproxy.org/
- Dependabot: https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically
- Spring Security Reference: https://docs.spring.io/spring-security/reference/

---

Si tu veux, je peux :
- Implémenter la petite modif pour externaliser `jwt.secret` (éditer `application.properties` en utilisant `${JWT_SECRET}`) et ajouter un exemple `application-prod.properties`.
- Ajouter un job GitHub Actions minimal `security-scan` qui lance `mvn -DskipTests=false test`, `mvn dependency:check` et un scan Zap simple.

Indique ce que tu veux que je fasse ensuite et je l'exécute.
