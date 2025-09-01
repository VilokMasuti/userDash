# Admin Users (MRT + MSW) — Intern-Level

Simple, readable demo that uses:
- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS for UI + tiny shadcn-like components (Button, Input, Badge, Toast)
- Material React Table (MRT) for the grid (uses @mui/material internally)
- MSW for a deterministic mock API (100 users seeded with faker.seed(42))

## Run

1) Install deps
   npm install

2) Initialize MSW worker once (generates `public/mockServiceWorker.js`):
   npx msw init public --save
   (This repo ships a tiny placeholder just in case. The above command replaces it with the official file.)

3) Start dev server
   npm run dev
   Open http://localhost:5173

## What this does

- GET /api/users?query=&status=&page=&pageSize= → returns `{ totalCount, users }`
- PATCH /api/users/:id → toggles `status` and returns updated user
- 100 users generated in `src/mocks/seed.ts` with `faker.seed(42)` (deterministic)
- Columns are derived from `src/utils/columnMeta.ts`
- Groups are rendered as chips and nested data is preserved
- Row selection, search, pagination (server-style), basic sorting (client-side), and row virtualization enabled
- Optimistic activate/deactivate with rollback + toast



## File map

- `src/pages/UsersPage.tsx` – main page + table
- `src/lib/axios.ts /utils/columnMeta.ts` – metadata and axios wapper
- `src/mocks/*` – MSW `handlers` + `seed` + `browser`
- `src/api/user.ts` – small API wrapper
- `src/components/ui/*` – minimal UI primitives
- `Dash/types` – minimal -types

src/
 ├─ api/
 │   └─ users.ts           # Small API wrapper
 ├─ components/
 │   ├─ error/
 │   │   └─ ErrorBoundary.tsx # Error boundary component
 │   ├─ table/
 │   │   └─ UsersTable.tsx    # Main MRT table (filters + state + table)
 │   └─ ui/                   # Minimal UI primitives
 │       ├─ Button.tsx
 │       ├─ Input.tsx
 │       ├─ Chip.tsx
 │       ├─ Toast.tsx
 │       └─ Skeleton.tsx
 ├─ mocks/
 │   ├─ browser.ts         # MSW browser setup
 │   ├─ handlers.ts        # API route mocks
 │   └─ seed.ts            # Deterministic faker data
 ├─ pages/
 │   └─ UsersPage.tsx      # Main page
 ├─ lib/
 │   ├─ axios.ts           # Axios wrapper
 │   ├─ types.ts           # Shared types
 │   └─ columnMeta.ts      # MRT column definitions
 └─ Dash/
     └─ types/             # Minimal types
