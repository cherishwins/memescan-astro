# MemeScan (Astro) - design preview with sample data

MemeScan is a static **design preview** of a meme token dashboard for TON,
built with Astro and a few React islands. It is not a working scanner.

Every token, price, stat, portfolio and leaderboard on the site is hardcoded
sample data. There is no live price feed, no token scanning, no rug or scam
detection, and no wallet connection. Nothing on the site is financial advice.
A notice saying so is pinned to the bottom of every page by
`src/layouts/Base.astro`.

Preview: [memescan-astro.vercel.app](https://memescan-astro.vercel.app)

## What is in the preview

- **Scanner** (`/`) - the dashboard layout: a sample price ticker and
  fictional example tokens with example safety scores
- **Trending** (`/crypto`) - a grid of fictional example token cards
- **Watchlist** (`/portfolio`) - a sample portfolio and watchlist
- **CryptoKart** (`/cryptokart`) - a points-only racing mini-game that runs
  in the browser; no money or tokens involved
- **Rewards** (`/rewards`) - mock missions, streaks and referral screens;
  nothing is stored or paid out

## Sample data rules

- Anything that carries a safety score, risk, rug or scam label uses
  **fictional** tokens ("Example Frog", `EX-FROG`). Never put such a label
  next to a real token name, ticker or address unless it comes from a real,
  documented check. `TokenCard` only shows a score when one is passed.
- Do not label sample figures as live or real-time.

## Project structure

```text
src/
├── layouts/Base.astro        # page shell, analytics, demo-data notice
├── pages/                    # one .astro file per route
├── components/static/        # Header, Footer, HeroBanner, TokenCard, StatCard
├── components/islands/       # React islands (ticker, game, missions, streak)
└── components/magic/         # ambient effects (MatrixRain, confetti)
public/                       # images and icons, served as-is
```

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm ci`          | Installs dependencies from the lockfile     |
| `npm run dev`     | Starts local dev server at `localhost:4321` |
| `npm run build`   | Builds the static site to `./dist/`         |
| `npm run preview` | Previews the build locally                  |

No environment variables are needed (see `.env.example`). The `Dockerfile`
builds `dist/` and serves it from nginx.
