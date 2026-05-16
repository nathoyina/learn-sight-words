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

The app has two sides — **teacher** (creates the class) and **child** (joins with a code). The placeholders on the login form (`Anna`, `1234`, `ABC123`) are just examples, not working credentials.

### Try it as a teacher (full flow)

1. Go to [`/teacher`](https://learn-sight-words.vercel.app/teacher) and sign up with any email + password.
2. In the dashboard, click **Create class** — you'll get a random 6-character code (e.g. `4F9K2A`).
3. Share that code with a child (or use it yourself in another browser tab).

### Try it as a child

1. Open [`/login`](https://learn-sight-words.vercel.app/login) and switch to the **Create My Profile** tab.
2. Enter any name, a PIN (4+ digits), and the **class code from a teacher** (see above).
3. Click **Create and Login** to start the placement quiz and play games.
4. Returning kids use the **Login** tab with just name + PIN (no class code needed).

### Quickest peek (no teacher signup)

If you just want to see the games without setting up a class, ask someone who already has a class code, or follow the [Local setup](#local-setup) below to seed your own Supabase instance.

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
