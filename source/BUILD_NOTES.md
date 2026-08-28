# Notes de build

Ce dossier contient le code source (Vite + React + TypeScript) du site.
Le site publié à la racine du repo est le résultat du build (`dist/public`).

Ce projet vient à l'origine d'un monorepo Replit (pnpm workspaces) avec une
API backend séparée (`@workspace/api-client-react`, PostgreSQL). Ce dépôt ne
contient que le frontend, rendu autonome :

- `package.json` : les versions `catalog:`/`workspace:*` (pnpm) ont été
  remplacées par des versions npm classiques.
- `src/lib/api-client-stub.ts` : remplace le package interne manquant
  `@workspace/api-client-react`. Sans API backend configurée, les données
  d'impact retombent sur leurs valeurs par défaut et les formulaires
  (contact, bénévolat, newsletter) affichent une erreur d'envoi — c'est
  attendu tant qu'aucune `VITE_API_BASE_URL` n'est branchée sur une vraie API.
- `vite.config.ts` : simplifié (retrait des plugins Replit dev-only).

## Pour rebuilder

```bash
cd source
npm install
npm run build        # génère dist/public
# copier le contenu de dist/public/ à la racine du repo, en gardant CNAME
```
