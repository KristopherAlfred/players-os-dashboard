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

## Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/dametime-dashboard.git
git push -u origin main
```

## License

MIT
