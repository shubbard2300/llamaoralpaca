# Llama or Alpaca 🦙

A fast, fun guessing game with real photos — is it a llama or an alpaca? Build your streak, learn the tells, and beat your best score.

- **Streak mode** — one mistake ends the round.
- **Blitz mode** — 60 seconds, rack up as many correct guesses as you can.
- Each round pulls a random batch of 10-15 real photos (mixed llama/alpaca) from an approved pool of 50+.
- Registered users can upload their own llama/alpaca photos. Uploads go into a **moderation queue** and only join the game once an admin approves them.

## Stack

Next.js (App Router) + Postgres + Vercel Blob for photo storage. Plain CSS, no UI framework.

## Local development

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (a local Postgres works fine) and `SESSION_SECRET` (any long random string).
3. `npm run migrate` — creates the `users` and `images` tables.
4. `npm run dev`

Uploads fall back to writing under `public/uploads` locally when `BLOB_READ_WRITE_TOKEN` isn't set, so the whole flow works without any cloud credentials.

## Seeding real photos

`npm run seed:commons` pulls real, freely-licensed llama & alpaca photography from Wikimedia Commons (with photographer attribution stored per image) and inserts them as pre-approved. Needs `DATABASE_URL` set and outbound internet access to `commons.wikimedia.org`.

## Moderation

Only users listed in the `ADMIN_EMAILS` env var (comma-separated) can access `/admin` to approve or reject pending user-submitted photos.

## Deploying

1. Import this repo into Vercel.
2. Add a Postgres database and a Blob store from the Vercel Storage tab; this sets `DATABASE_URL` / `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN` automatically.
3. Set `SESSION_SECRET` (e.g. `openssl rand -base64 32`) and `ADMIN_EMAILS` as project env vars.
4. Run `npm run migrate` once against the production `DATABASE_URL`, then `npm run seed:commons` to populate real photos.
