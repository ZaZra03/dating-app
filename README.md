# Spark — Dating App (Next.js + Prisma)

Modern demo dating app built with Next.js App Router, TypeScript, Prisma (PostgreSQL), TailwindCSS, and shadcn/ui. It supports swiping, matching, chatting, and basic profile management.

## Features
- **Auth**: Email/password signup + login, JWT stored in localStorage
- **Discover**: Swipe like/skip with age filter
- **Matches**: List of your mutual matches, open chat, unmatch
- **Chat**: Realtime-like UI with message persistence via API
- **Likes**: People who liked you (but aren’t matched yet)
- **Settings**: Theme and notifications toggles
- **Protected routes**: Dashboard pages gated using `withAuth`

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React + TypeScript
- Prisma ORM + PostgreSQL
- TailwindCSS + shadcn/ui + lucide-react

## Folder Structure (partial)
- `app/api/*` — API route handlers (auth, swipe, matches, chat, etc.)
- `app/(dashboard)/*` — Authenticated pages (discover, liked-me, matches, chat, settings)
- `app/(pages)/*` — Additional pages (profile, about-you)
- `app/lib/withAuth.tsx` — Client HOC to protect pages via JWT
- `prisma/schema.prisma` — DB schema (User, Swipe, Match, ChatSession, ChatMessage)

## Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database

## Environment Variables
Create `.env` with:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=your-32+char-secret
# Optional (used in sign-out call); defaults to http://localhost:3001 if not set
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Setup
```bash
pnpm install
pnpm prisma migrate dev  # creates DB tables
pnpm dev                 # starts Next.js at http://localhost:3000
```

## Scripts
- `pnpm dev` — Start dev server
- `pnpm build` — Build
- `pnpm start` — Run production build
- `pnpm prisma migrate dev` — Apply schema

## Authentication Model
- On login/signup, the API returns a JWT signed with `JWT_SECRET`.
- The token is stored in `localStorage` as `token`.
- Client pages fetch with `Authorization: Bearer <token>`.

### Protected Pages
Pages wrapped with `withAuth` redirect to `/login` if no token:
- `/discover`
- `/liked-me`
- `/matches`
- `/chat`
- `/settings`
- `/profile`
- `/about-you`

## Core API Endpoints (summary)
- `POST /api/auth/signup` — Create account, returns `{ access_token, user }`
- `POST /api/auth/login` — Login, returns `{ access_token, user }`
- `GET /api/swipe/next?ageMin&ageMax` — Next profile to swipe
- `POST /api/swipe` — Body `{ toUserId, direction: 'like'|'skip' }`
- `GET /api/liked-me` — Users who liked you (not matched yet)
- `GET /api/matches` — Your matches with other user info
- `DELETE /api/matches/:id` — Unmatch; also deletes session/messages and mutual swipes
- `GET /api/chat/messages?matchId=ID&limit=200` — Fetch chat history
- `POST /api/chat/messages` — Persist new messages for a match

## Test Accounts
If your database is empty, create these accounts via the Signup page or `POST /api/auth/signup`. Use the same passwords when logging in.

- Email: `alice@example.com` — Password: `Password123!`
- Email: `bob@example.com` — Password: `Password123!`
- Email: `charlie@example.com` — Password: `Password123!`

Suggested flow to test:
1. Login as Alice and go to Discover; like Bob.
2. Login as Bob and like Alice back → you should see a match and be able to chat.
3. From Matches, open Chat, send messages, then unmatch — the match and its related chat data are deleted; Bob/Alice should not reappear in “Liked Me”.

## Troubleshooting
- After editing route files, if you see errors like “params is a Promise,” restart the dev server to clear Turbopack cache.
- If Prisma complains about missing tables, run `pnpm prisma migrate dev`.
- If `/default-profile.jpg` 404s, provide an image at `public/default-profile.jpg` or adjust the UI to your needs.

## License
MIT — for demo purposes.

