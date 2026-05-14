# Video Agent

A Vite + React prototype for the RecCloud video agent experience.

## Local Development

**Prerequisites:** Node.js 22 or newer.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local dev server:

   ```bash
   npm run dev
   ```

3. Open the local URL printed by Vite, usually `http://localhost:3000`.

## Build

```bash
npm run build
```

The production build is generated in `dist/`.

## GitHub Pages Preview

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

After pushing the project to GitHub:

1. Open the repository on GitHub.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to the `main` branch, or run the **Deploy to GitHub Pages** workflow manually from the **Actions** tab.

The preview URL will be:

```text
https://<github-username>.github.io/<repository-name>/
```

For this project, if the repository is named `video-agent`, the URL will look like:

```text
https://<github-username>.github.io/video-agent/
```
