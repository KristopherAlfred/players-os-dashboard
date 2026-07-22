# Sloane Dashboard

Cloned from Dame Time AMX dashboard. Edit branding, data sources, and env vars for Sloane Stephens — Dame projects are unchanged.

# DAME.TIME Dashboard

Pixel-faithful recreation of the **DAME.TIME Dashboard Overview** — a dark-themed analytics dashboard for the DameTime content ecosystem.

![Dashboard preview](./docs/preview.png)

## Stack

- **React 19** + **TypeScript**
- **Vite** for dev and build
- **Tailwind CSS v4** for styling
- **Recharts** for charts
- **Lucide React** for icons

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     # UI sections (sidebar, KPIs, charts, tables, etc.)
  data/           # Mock analytics data matching the design spec
  App.tsx         # Main layout
```

## Push to GitHub (do not drag-and-drop files on the website)

GitHub’s web uploader limits how many files you can add at once and should **never** include `node_modules` (150MB+). Use Git from your terminal instead — only **32 source files** are tracked.

1. On [github.com/new](https://github.com/new), create a repo named `dametime-dashboard` (empty: no README, no .gitignore).
2. Replace `YOUR_GITHUB_USERNAME` below and run:

```bash
cd /Users/demetriwilliams/dametime-dashboard
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dametime-dashboard.git
git push -u origin main
```

If GitHub asks you to sign in, use a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens), not your GitHub password.

## Deploy on Vercel

**Option A — GitHub (recommended)**

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import **`himdemetrii/dametime-dashboard`**.
3. Leave defaults (Vite is auto-detected):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Every `git push` to `main` will redeploy automatically.

**Option B — CLI**

```bash
cd /Users/demetriwilliams/dametime-dashboard
npx vercel
npx vercel --prod
```

Live URL will look like `https://dametime-dashboard.vercel.app` (or a custom name you choose in the Vercel dashboard).

## License

MIT
