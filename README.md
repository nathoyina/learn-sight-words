# Sight Word Adventure

A kid-friendly English learning game for ages ~7 with:

- placement quiz,
- level-based games (sight words, phonics, rhymes, vocabulary, sentence building),
- cloud-synced progress across devices.

## Tech

- React + Vite + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + RPC)


## Demo

View public link on vercel here: https://learn-sight-words.vercel.app

## Local setup

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `cp .env.example .env`
3. Fill in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run database schema:
   - Open Supabase SQL Editor
   - Paste and run `supabase/schema.sql`
5. Start app:
   - `npm run dev`

## Database model

Schema is in `supabase/schema.sql` and includes:

- `teachers` (linked to Supabase auth users)
- `classes` (teacher-owned, with join `code`)
- `students` (kid name + hashed PIN + JSON progress)

Kid access uses RPC functions (not direct table reads):

- `kid_login`
- `kid_self_join`
- `kid_get_progress`
- `kid_update_progress`

## App routes

- Kid login: `/login`
- Kid app: `/`, `/quiz`, `/map`, `/games/...`
- Teacher auth: `/teacher`
- Teacher dashboard: `/teacher/dashboard`

## Verify

- `npm run lint`
- `npm run build`


## Cross-device smoke test

1. On device A, teacher signs in and creates a class.
2. Copy class code.
3. On device B, child logs in via `/login` with class code + name + PIN.
4. Play a game and earn stars.
5. On device C (or fresh browser), log in with same child credentials.
6. Confirm stars/unlocked levels are synced.
