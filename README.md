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

The site is deployed to **[national-parks.weijil.com](https://national-parks.weijil.com)** via GitHub Pages. Every push to `master` triggers the GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)), which builds and deploys automatically.

### Infrastructure

| Layer | Provider | Detail |
|---|---|---|
| Hosting | GitHub Pages | `weiji-li/national-parks`, source: GitHub Actions |
| Custom domain | Netlify DNS | CNAME `national-parks` → `weiji-li.github.io` |
| Domain registrar | Squarespace | `weijil.com` — nameservers delegate to Netlify DNS |

> **Important:** `weijil.com`'s nameservers point to Netlify, not Squarespace. All DNS changes must be made in **Netlify**, even though the domain was registered/migrated via Squarespace. Changes made in Squarespace DNS will have no effect.

---

### Deploying a new app to a subdomain of weijil.com

Follow these steps each time you want to deploy a new app (e.g. `myapp.weijil.com`).

#### Step 1 — Add the GitHub Actions workflow to your repo

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

#### Step 2 — Add a CNAME file to your repo

Create `public/CNAME` (no file extension) with just your subdomain:

```
myapp.weijil.com
```

This tells GitHub Pages which custom domain to serve the site from.

#### Step 3 — Configure GitHub Pages

1. Push your code to `master` to trigger the first deploy
2. Go to your repo on GitHub → **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Under **Custom domain**, enter `myapp.weijil.com` and click **Save**

#### Step 4 — Add the DNS record in Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Domains** → click `weijil.com` → **DNS settings**
2. Click **Add new record** and fill in:
   - **Type**: `CNAME`
   - **Name**: `myapp`
   - **Value**: `weiji-li.github.io`
   - **TTL**: 3600 (default)
3. Click **Save**

#### Step 5 — Verify

DNS usually propagates within a few minutes. To check from your terminal:

```bash
nslookup myapp.weijil.com 8.8.8.8
```

You should see it resolve to GitHub's IPs (`185.199.x.x`). If your browser shows a blank page, flush your local DNS cache:

```bash
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder
```

Once DNS resolves, go back to **GitHub Pages settings** and click **Check again** to clear the DNS validation warning and provision the HTTPS certificate.
