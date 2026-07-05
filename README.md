# Le Semainier

Application de planification de batchcooking (React + Vite), packagée en :
- **Application Android (.apk)** via Capacitor
- **Application Windows (.exe)** via Electron

La compilation réelle des binaires se fait automatiquement sur **GitHub Actions** quand tu pousses ce projet sur GitHub (ton ordinateur n'a rien à installer).

## 1. Mettre le projet sur GitHub

```bash
cd semainier-app
git init
git add .
git commit -m "Premier envoi du Semainier"
```

Puis sur github.com : crée un nouveau dépôt (vide, sans README), et suis les instructions "…or push an existing repository from the command line" affichées sur la page, par exemple :

```bash
git remote add origin https://github.com/TON-PSEUDO/semainier.git
git branch -M main
git push -u origin main
```

## 2. Récupérer les fichiers .apk et .exe

Dès que le code est poussé sur la branche `main`, deux workflows se lancent automatiquement (visibles dans l'onglet **Actions** du dépôt) :
- `Build Android APK`
- `Build Windows EXE`

Ils prennent quelques minutes. Une fois terminés :
- Va dans l'onglet **Releases** du dépôt (à droite de la page GitHub) : tu y trouveras `app-debug.apk` et `Le Semainier Setup.exe`, prêts à télécharger.
- Ils sont aussi disponibles dans l'onglet **Actions → (le run terminé) → Artifacts** si tu préfères.

## 3. Installer

- **Android** : transfère le `.apk` sur ton téléphone et ouvre-le (il faudra autoriser "sources inconnues" dans les réglages Android — normal pour une app hors Play Store).
- **Windows** : lance le `.exe`, l'installateur (NSIS) s'occupe du reste.

## 4. Clé API Anthropic

L'app appelle l'API Claude directement depuis ton appareil pour générer les plannings. Au premier lancement, colle ta clé API (créée sur https://console.anthropic.com) dans l'onglet **Générer**. Elle reste stockée uniquement en local sur ton appareil.

## Développement local (optionnel)

```bash
npm install
npm run dev        # aperçu web sur http://localhost:5173
npm run build      # build de production dans dist/
```

## Relancer une compilation manuellement

Dans l'onglet **Actions** de GitHub, choisis le workflow puis clique sur **Run workflow**.
