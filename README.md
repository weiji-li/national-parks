# National Parks Explorer

A web app for discovering and tracking visits to national parks across the US and Canada.

## Features

- **Explore** — Browse ~470 national parks with grid, list, and interactive map views. Filter by state, search by name or description, and sort by popularity or visitor count.
- **Park Details** — View images, activities, operating hours, entrance fees, and addresses for each park.
- **Visit Logging** — Log visits with dates and personal notes. Track multiple visits per park in a timeline view with total visit and unique park counts.
- **Dashboard** — See your stats and unlock achievement badges based on your visit patterns.
- **Wishlist** — Save parks you want to visit later.

## Tech Stack

- **React 19 + TypeScript + Vite**
- **Zustand** — state management with local storage persistence
- **React Router** — client-side routing
- **Leaflet / React Leaflet** — interactive maps
- **Framer Motion** — animations

## Data Sources

- [NPS Developer API](https://developer.nps.gov) — park info, images, activities, hours, and fees for US parks (~471 parks)
- Parks Canada — Canadian national parks via hardcoded data

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file and add your NPS API key (free at [developer.nps.gov](https://developer.nps.gov)):
   ```
   VITE_NPS_API_KEY=your_api_key_here
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Deployment

The site is deployed to **[national-parks.weijil.com](https://national-parks.weijil.com)** via GitHub Pages.

### How it works

Every push to `master` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds the app and deploys it to GitHub Pages automatically. No manual steps needed.

### Infrastructure

| Layer | Provider | Detail |
|---|---|---|
| Hosting | GitHub Pages | `weiji-li/national-parks` repo, source: GitHub Actions |
| Custom domain | Netlify DNS | CNAME `national-parks` → `weiji-li.github.io` |
| Domain registrar | Squarespace | `weijil.com` — nameservers delegate to Netlify DNS |

### If you need to re-configure from scratch

1. **Netlify DNS** — add a CNAME record: `national-parks` → `weiji-li.github.io`
2. **GitHub Pages** (`Settings → Pages`):
   - Source: **GitHub Actions**
   - Custom domain: `national-parks.weijil.com`
3. The `public/CNAME` file in this repo must contain `national-parks.weijil.com` (already committed)

> **Note:** `weijil.com` uses custom nameservers (Netlify DNS), so DNS changes must be made in Netlify — not in Squarespace.
