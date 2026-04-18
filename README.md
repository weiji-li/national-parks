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
