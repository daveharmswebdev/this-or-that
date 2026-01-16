# Versus - Architecture Document

**Author:** Walt Harms
**Date:** 2026-01-15
**Version:** 1.0
**Status:** Draft

---

## Document Purpose

This document captures architectural decisions for Versus, a movie preference ranking game. Architecture Decision Records (ADRs) are numbered and immutable once accepted.

---

## Architecture Decision Records

### ADR-001: CI/CD Pipeline and Testing Strategy

**Status:** Accepted
**Date:** 2026-01-15
**Context:** Developer has 10 years experience (medtech, fintech) and learned from first agentic project that CI/CD and testing must be established from day one, not bolted on later.

---

#### Decision

We will use **GitHub Actions for CI** (continuous integration) and **Render for CD** (continuous deployment), with Render configured to deploy only after CI checks pass.

---

#### CI/CD Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DEVELOPMENT FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

  Developer                    GitHub                         Render
      │                           │                              │
      │  1. Create feature branch │                              │
      │  2. Push commits          │                              │
      │─────────────────────────▶│                              │
      │                           │                              │
      │  3. Open PR to main       │                              │
      │─────────────────────────▶│                              │
      │                           │                              │
      │                           │  4. GitHub Actions CI        │
      │                           │     ┌──────────────────┐     │
      │                           │     │ - Lint (Biome)   │     │
      │                           │     │ - Typecheck (tsc)│     │
      │                           │     │ - Unit tests     │     │
      │                           │     │ - Integration    │     │
      │                           │     │ - Build verify   │     │
      │                           │     └──────────────────┘     │
      │                           │                              │
      │  5. PR Review             │                              │
      │◀─────────────────────────│                              │
      │                           │                              │
      │  6. Merge to main         │                              │
      │─────────────────────────▶│                              │
      │                           │                              │
      │                           │  7. CI runs on main          │
      │                           │─────────────────────────────▶│
      │                           │                              │
      │                           │     8. Render waits for      │
      │                           │        CI checks to pass     │
      │                           │                              │
      │                           │     9. Render builds &       │
      │                           │        deploys               │
      │                           │                              │
      │                           │  10. Live on production      │
      │◀──────────────────────────────────────────────────────────│
      │                           │                              │
```

---

#### Branching Strategy: GitHub Flow

```
main ─────●─────●─────●─────●─────●─────●───▶ (always deployable)
           \         /       \         /
            ●───●───●         ●───●───●
           feature/foo       feature/bar
```

**Rules:**
- `main` is always deployable
- All work happens on feature branches
- PRs required for all changes to `main`
- Branch naming: `feature/`, `fix/`, `chore/`, `docs/`
- Delete branches after merge

---

#### GitHub Actions CI Pipeline

**Trigger:** Pull requests to `main`, pushes to `main`

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.1.x"
      - run: bun install --frozen-lockfile
      - run: bun run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.1.x"
      - run: bun install --frozen-lockfile
      - run: bun run typecheck

  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.1.x"
      - run: bun install --frozen-lockfile
      - run: bun run test:unit --coverage
      - name: Check coverage threshold
        run: bun run test:coverage-check

  test-integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: versus_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.1.x"
      - run: bun install --frozen-lockfile
      - run: bun run db:migrate:test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/versus_test
      - run: bun run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/versus_test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.1.x"
      - run: bun install --frozen-lockfile
      - run: bun run build
```

**Jobs run in parallel** where possible (lint, typecheck, test-unit, test-integration, build).

---

#### Render CD Configuration

**Settings:**
- **Branch:** `main`
- **Auto-Deploy:** "After CI Checks Pass"
- **Build Command:** `bun install && bun run build`
- **Start Command:** `bun run start`

**Deploy Control:**
- Skip specific deploys with `[skip render]` or `[render skip]` in commit message
- Manual deploys available via deploy hooks
- Render only deploys after all GitHub Actions checks pass

---

#### Pre-commit Hooks: Husky + lint-staged

**Purpose:** Faster feedback loop - catch issues before CI

**Configuration:**

`.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
bunx lint-staged
```

`package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome check --apply",
      "biome format --write"
    ],
    "*.{json,md}": [
      "biome format --write"
    ]
  }
}
```

**What runs locally:**
- Biome lint + format on staged files only
- Fast (~1-3 seconds)
- Full test suite runs in CI, not pre-commit

---

#### Testing Pyramid

```
                    ┌───────────────┐
                    │     E2E       │  Playwright (post-MVP)
                    │   (critical)  │  - Full game completion
                    └───────┬───────┘
                            │
                   ┌────────┴────────┐
                   │   Integration   │  Vitest + Postgres service
                   │    (API + DB)   │  - API endpoints
                   └────────┬────────┘  - Database operations
                            │
      ┌─────────────────────┴─────────────────────┐
      │              Unit Tests                   │  Vitest
      │               (logic)                     │  - Swiss tournament engine
      │                                           │  - Pairing algorithm
      │                                           │  - Tiebreaker calculations
      │                                           │  - Commentary generation
      └───────────────────────────────────────────┘
```

---

#### Test Tooling

| Layer | Tool | Location | Runs In |
|-------|------|----------|---------|
| Unit | Vitest | `**/*.test.ts` | CI + Local |
| Integration | Vitest + Postgres | `**/*.integration.test.ts` | CI (+ Local via Docker) |
| E2E | Playwright | `e2e/**/*.spec.ts` | CI (post-MVP) |
| Coverage | Vitest (c8) | Built-in | CI |
| Linting | Biome | Config file | Pre-commit + CI |
| Type checking | TypeScript | `tsconfig.json` | Pre-commit + CI |

---

#### Database Environments

| Environment | Database | Persistent? | Purpose |
|-------------|----------|-------------|---------|
| Local dev | Docker Compose Postgres 16 | Yes (volume) | Development |
| Integration tests | Testcontainers (ephemeral) | No | Local test isolation |
| CI tests | GitHub Actions service container | No | PR/merge verification |
| Production | Render Postgres (`versus` schema) | Yes | Live application |

**Local Development:**
- Docker Compose with Postgres 16, persistent volume
- Data survives container restarts
- `docker-compose.yml` at repo root
- `bun run db:migrate` applies migrations

**Integration Tests (Local):**
- Testcontainers spins up fresh Postgres per test run
- Isolated, reproducible, matches production
- No test pollution between runs

**CI (GitHub Actions):**
- Postgres service container (see workflow above)
- Fresh database per CI run
- Migrations applied before tests

**Fallback:**
- If Docker unavailable locally, can connect to Render test schema
- Environment variable `DATABASE_URL` overrides default

---

#### Coverage Requirements

**Global Threshold:** 70% minimum

**Enforced in CI:**
```json
// vitest.config.ts
{
  "coverage": {
    "provider": "v8",
    "reporter": ["text", "json", "html"],
    "thresholds": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

**CI fails if coverage drops below 70%.**

---

#### Package Scripts

```json
{
  "scripts": {
    "dev": "bun run --hot src/index.ts",
    "build": "bun build ./src/index.ts --outdir ./dist --target bun",
    "start": "bun run dist/index.js",
    "lint": "biome check .",
    "lint:fix": "biome check --apply .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:unit": "vitest run --exclude '**/*.integration.test.ts'",
    "test:integration": "vitest run --include '**/*.integration.test.ts'",
    "test:coverage": "vitest run --coverage",
    "test:coverage-check": "vitest run --coverage --coverage.thresholdAutoUpdate=false",
    "db:migrate": "drizzle-kit migrate",
    "db:migrate:test": "drizzle-kit migrate",
    "db:generate": "drizzle-kit generate",
    "db:studio": "drizzle-kit studio",
    "prepare": "husky"
  }
}
```

---

#### Consequences

**Positive:**
- Quality gates enforced before any code reaches production
- Fast local feedback via pre-commit hooks
- Parallel CI jobs minimize wait time
- Clear separation: GitHub owns testing, Render owns deployment
- Coverage tracking prevents regression

**Negative:**
- Docker required for local integration tests (mitigated by Render fallback)
- CI adds ~2-5 minutes to merge-to-deploy time
- Husky setup required for new developers

**Risks Mitigated:**
- Broken code reaching production (CI gate)
- "Works on my machine" issues (containerized tests)
- Coverage decay over time (threshold enforcement)
- Slow feedback loops (parallel jobs, local hooks)

---

#### References

- Render Auto-Deploy: "After CI Checks Pass" setting
- Render deploy skip: `[skip render]` or `[render skip]` in commit message
- GitHub Actions: Postgres service containers
- Vitest: Coverage thresholds configuration

---

### ADR-002: Runtime and Framework Stack

**Status:** Accepted
**Date:** 2026-01-15
**Context:** Need to select runtime, frameworks, and tooling that align with PRD decisions (Bun, React) while supporting testability.

---

#### Decision

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Runtime | Bun | 1.x | Fast, modern, TypeScript-native |
| Backend Framework | Hono | 4.x | Lightweight, fast, excellent TypeScript support |
| Frontend Framework | React | 18.x | PRD requirement, mature ecosystem |
| Frontend Build | Vite | 5.x | Fast dev server, optimized builds |
| ORM | Drizzle | 0.30+ | Type-safe, lightweight, great migrations |
| Database | PostgreSQL | 16 | Render existing instance |
| Styling | TBD | - | To be decided (Tailwind likely) |

---

#### Project Structure

```
versus/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   └── pre-commit
├── apps/
│   ├── api/                    # Bun + Hono backend
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── routes/
│   │   │   │   ├── genres.ts
│   │   │   │   └── movies.ts
│   │   │   ├── db/
│   │   │   │   ├── schema.ts   # Drizzle schema
│   │   │   │   ├── index.ts    # DB connection
│   │   │   │   └── migrations/
│   │   │   └── lib/
│   │   │       └── omdb.ts     # OMDB client
│   │   ├── test/
│   │   │   ├── routes.integration.test.ts
│   │   │   └── setup.ts
│   │   └── package.json
│   │
│   └── web/                    # React + Vite frontend
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   │   └── tournament/
│       │   │       ├── engine.ts
│       │   │       ├── pairing.ts
│       │   │       ├── tiebreaker.ts
│       │   │       └── __tests__/
│       │   │           ├── engine.test.ts
│       │   │           ├── pairing.test.ts
│       │   │           └── tiebreaker.test.ts
│       │   ├── pages/
│       │   └── types/
│       ├── test/
│       │   └── setup.ts
│       ├── index.html
│       └── package.json
│
├── packages/                   # Shared code (if needed)
│   └── shared/
│       └── types/
│
├── scripts/
│   └── seed.ts                 # Movie seeding CLI
│
├── biome.json
├── package.json                # Workspace root
├── tsconfig.json
└── README.md
```

---

#### Monorepo vs Polyrepo

**Decision:** Monorepo with Bun workspaces

**Rationale:**
- Single repo for API + Web simplifies CI/CD
- Shared types without publishing
- Atomic commits across frontend/backend
- Bun workspaces are simple and fast

---

### ADR-003: State Management (Frontend)

**Status:** Proposed
**Date:** 2026-01-15
**Context:** Need to manage game state including tournament progress, comparisons, and results.

---

#### Decision

| Concern | Solution | Rationale |
|---------|----------|-----------|
| Server state | TanStack Query | Caching, refetching, loading states |
| Game state | Zustand | Simple, minimal boilerplate, easy to test |
| Persistence | localStorage adapter | Zustand middleware for auto-persist |
| URL state | None (MVP) | No deep linking per requirements |

---

#### Game State Shape

```typescript
interface GameState {
  // Current game
  status: 'idle' | 'selecting' | 'playing' | 'results';
  genre: string | null;
  movies: Movie[];

  // Tournament state
  round: number;
  comparisons: Comparison[];
  currentMatchup: [Movie, Movie] | null;
  standings: Standing[];

  // Results
  finalRanking: Movie[];
  commentary: string[];
  startTime: number | null;
  endTime: number | null;

  // Session
  seenMovieIds: string[];

  // Actions
  selectGenre: (genre: string) => void;
  makeChoice: (winnerId: string) => void;
  playAgain: () => void;
  abandonGame: () => void;
}
```

---

#### Persistence Strategy

```typescript
// Zustand with localStorage persistence
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'versus-game',
      partialize: (state) => ({
        // Only persist what's needed for resume
        status: state.status,
        genre: state.genre,
        movies: state.movies,
        round: state.round,
        comparisons: state.comparisons,
        standings: state.standings,
        seenMovieIds: state.seenMovieIds,
        startTime: state.startTime,
      }),
    }
  )
);
```

---

### ADR-004: API Design

**Status:** Proposed
**Date:** 2026-01-15
**Context:** Define API contract between frontend and backend.

---

#### Endpoints

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/api/genres` | List available genres | `Genre[]` |
| GET | `/api/games/start?genre={slug}` | Start game, get 10 random movies | `Movie[]` |
| GET | `/api/movies/:imdbId` | Get single movie (optional) | `Movie` |
| GET | `/api/health` | Health check for Render | `{ status: 'ok' }` |

---

#### Response Types

```typescript
interface Genre {
  slug: string;
  name: string;
  icon: string;
  movieCount: number;
}

interface Movie {
  imdbId: string;
  title: string;
  year: string;
  posterUrl: string | null;
}

interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
```

---

#### Error Responses

| Status | Meaning | When |
|--------|---------|------|
| 200 | Success | Normal response |
| 400 | Bad Request | Invalid genre slug |
| 404 | Not Found | Movie not found |
| 500 | Server Error | Database/OMDB failure |
| 503 | Service Unavailable | Database connection failure |

---

## Pending Decisions

The following decisions are deferred:

| Topic | Status | Notes |
|-------|--------|-------|
| Styling approach | Deferred | Tailwind likely, decide during implementation |
| Animation library | Deferred | Framer Motion likely for swipe gestures |
| E2E test implementation | Deferred | Post-MVP, Playwright ready |
| Error tracking | Deferred | Sentry or similar, post-MVP |
| Analytics | Deferred | Out of scope for MVP per PRD |

---

## Infrastructure Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐    │
│   │   Render    │      │   Render    │      │   Render    │    │
│   │   Static    │─────▶│   Bun API   │─────▶│  PostgreSQL │    │
│   │   (React)   │      │   (Hono)    │      │   (versus)  │    │
│   └─────────────┘      └─────────────┘      └─────────────┘    │
│         │                     │                                 │
│         │                     │ (one-time per movie)           │
│         │                     ▼                                 │
│         │              ┌─────────────┐                         │
│         │              │  OMDB API   │                         │
│         │              │  (Patreon)  │                         │
│         │              └─────────────┘                         │
│         │                                                       │
│         └─────────────────────────────────────────────────────▶│
│                        User Browser                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. Run `/plan-stories` to break architecture into implementable user stories
2. First stories should establish CI/CD pipeline and project scaffolding

---

*Generated via architecture decision session*
