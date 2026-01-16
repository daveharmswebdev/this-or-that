# Versus - Epics and User Stories

**Author:** Walt Harms
**Date:** 2026-01-15
**Version:** 1.0
**Status:** Draft

---

## Document Purpose

This document breaks down the Versus MVP into epics and user stories, ordered for implementation. Epic 0 establishes infrastructure before any feature work, following the principle: CI/CD and testing first.

---

## Epic Overview

| Epic | Name | Stories | Priority |
|------|------|---------|----------|
| E0 | Project Foundation | 6 | Must - First |
| E1 | Backend API & Data | 5 | Must |
| E2 | Swiss Tournament Engine | 4 | Must |
| E3 | Genre Selection | 3 | Must |
| E4 | Game Interaction | 5 | Must |
| E5 | Results & Commentary | 4 | Must |
| E6 | Session Persistence | 4 | Must |
| E7 | Polish & Accessibility | 4 | Should |

**Total Stories:** 35

---

## Epic 0: Project Foundation

**Goal:** Establish CI/CD pipeline, project scaffolding, and database schema before any feature work. This epic must be completed first.

**Why First:** ADR-001 mandates CI/CD from day one. All subsequent work flows through this pipeline.

---

### Story 0.1: Repository and Monorepo Setup

**As a** developer,
**I want** a properly configured monorepo with Bun workspaces,
**So that** I have a clean foundation for backend and frontend code.

**Acceptance Criteria:**
- [ ] Git repository initialized with `.gitignore`
- [ ] `package.json` at root with Bun workspaces configured
- [ ] `apps/api/` directory with `package.json` for Hono backend
- [ ] `apps/web/` directory with `package.json` for React frontend
- [ ] `tsconfig.json` with strict mode, path aliases configured
- [ ] `biome.json` with lint and format rules
- [ ] `README.md` with project overview and setup instructions

**Requirements:** NFR-704, NFR-707

**Estimate:** S

---

### Story 0.2: GitHub Actions CI Pipeline

**As a** developer,
**I want** a GitHub Actions workflow that runs lint, typecheck, and tests,
**So that** broken code cannot merge to main.

**Acceptance Criteria:**
- [ ] `.github/workflows/ci.yml` created
- [ ] CI triggers on PR to main and push to main
- [ ] Lint job runs Biome check
- [ ] Typecheck job runs `tsc --noEmit`
- [ ] Unit test job runs Vitest (placeholder test passes)
- [ ] Integration test job with Postgres service container
- [ ] Build job verifies `bun run build` succeeds
- [ ] All jobs run in parallel where possible
- [ ] CI badge added to README

**Requirements:** ADR-001, NFR-701

**Estimate:** M

---

### Story 0.3: Pre-commit Hooks

**As a** developer,
**I want** pre-commit hooks that run lint and format,
**So that** I get fast feedback before pushing.

**Acceptance Criteria:**
- [ ] Husky installed and configured
- [ ] `lint-staged` configured for `.ts`, `.tsx`, `.json`, `.md` files
- [ ] Pre-commit runs Biome check and format on staged files
- [ ] Hook executes in < 5 seconds for typical changes
- [ ] `prepare` script in `package.json` installs hooks

**Requirements:** ADR-001

**Estimate:** S

---

### Story 0.4: Local Development Environment

**As a** developer,
**I want** Docker Compose for local Postgres and documented setup steps,
**So that** I can develop without external dependencies.

**Acceptance Criteria:**
- [ ] `docker-compose.yml` with Postgres 16 and persistent volume
- [ ] `.env.example` with all required environment variables
- [ ] `bun run dev` starts API with hot reload
- [ ] `bun run dev:web` starts React dev server
- [ ] Database connection verified on startup
- [ ] Setup instructions in README

**Requirements:** ADR-001 (Database Environments)

**Estimate:** S

---

### Story 0.5: Database Schema and Migrations

**As a** developer,
**I want** Drizzle ORM configured with the movies schema,
**So that** I have type-safe database access.

**Acceptance Criteria:**
- [ ] Drizzle installed with PostgreSQL driver
- [ ] `apps/api/src/db/schema.ts` defines movies table per spec
- [ ] `apps/api/src/db/schema.ts` defines genres table (optional, for future)
- [ ] Schema uses `versus` schema prefix for isolation
- [ ] `drizzle.config.ts` configured for migrations
- [ ] Initial migration generated and applies cleanly
- [ ] `bun run db:migrate` applies migrations
- [ ] `bun run db:generate` generates new migrations
- [ ] Integration test verifies schema creation

**Requirements:** FR-201, FR-203, NFR-705, NFR-706

**Data Model:**
```
versus.movies:
  - id: SERIAL PRIMARY KEY
  - imdb_id: VARCHAR(12) UNIQUE NOT NULL
  - title: VARCHAR(255) NOT NULL
  - year: VARCHAR(10) NOT NULL
  - poster_url: TEXT
  - genres: TEXT[] NOT NULL
  - fetched_at: TIMESTAMP NOT NULL
  - created_at: TIMESTAMP DEFAULT NOW()
```

**Estimate:** M

---

### Story 0.6: Vitest Configuration and First Tests

**As a** developer,
**I want** Vitest configured with coverage thresholds,
**So that** I can write tests from day one.

**Acceptance Criteria:**
- [ ] Vitest installed in both `apps/api` and `apps/web`
- [ ] `vitest.config.ts` with coverage provider (v8)
- [ ] Coverage threshold set to 70% global
- [ ] Test scripts: `test`, `test:unit`, `test:integration`, `test:coverage`
- [ ] Sample unit test passes
- [ ] Sample integration test connects to Postgres service
- [ ] Coverage report generates in CI
- [ ] CI fails if coverage drops below threshold

**Requirements:** ADR-001, NFR-701

**Estimate:** M

---

## Epic 1: Backend API & Data

**Goal:** Implement the backend API that serves movie data and proxies OMDB.

**Depends on:** Epic 0

---

### Story 1.1: Hono API Scaffolding

**As a** developer,
**I want** a Hono server with health check endpoint,
**So that** I have a running backend to build on.

**Acceptance Criteria:**
- [ ] Hono installed in `apps/api`
- [ ] `src/index.ts` creates and starts Hono app
- [ ] `GET /api/health` returns `{ status: 'ok', timestamp: ... }`
- [ ] Server runs on configurable port (default 3000)
- [ ] CORS configured for frontend origin
- [ ] Error handling middleware catches unhandled errors
- [ ] Integration test verifies health endpoint

**Requirements:** FR-804, FR-805

**Estimate:** S

---

### Story 1.2: OMDB Client Service

**As a** developer,
**I want** an OMDB client that fetches and caches movie data,
**So that** I can populate the database.

**Acceptance Criteria:**
- [ ] `src/lib/omdb.ts` implements OMDB API client
- [ ] Client uses API key from environment variable
- [ ] `fetchMovie(imdbId)` returns typed movie data
- [ ] Client validates IMDB ID format (tt + 7-8 digits)
- [ ] Client handles OMDB error responses gracefully
- [ ] Client logs API calls for monitoring
- [ ] Unit tests with mocked responses
- [ ] Rate limiting awareness (log warnings if approaching limit)

**Requirements:** FR-205, FR-206, FR-805, FR-806, NFR-602

**Estimate:** M

---

### Story 1.3: Movie Seed Script

**As a** developer,
**I want** a CLI script to seed movies from a curated list,
**So that** I can populate the database before launch.

**Acceptance Criteria:**
- [ ] `scripts/seed.ts` reads IMDB IDs and genres from JSON file
- [ ] Script fetches each movie from OMDB (if not in DB)
- [ ] Script stores movie in database with genres
- [ ] Script is idempotent (skips existing movies)
- [ ] Script reports progress: success/skip/fail per movie
- [ ] Script validates IMDB ID format before calling OMDB
- [ ] `bun run seed` executes the script
- [ ] Seed data file with 30+ movies per genre (150+ total)

**Requirements:** FR-901, FR-902, FR-903, FR-904, FR-906, FR-907

**Estimate:** M

---

### Story 1.4: Genres API Endpoint

**As a** frontend,
**I want** `GET /api/genres` to return available genres,
**So that** I can display genre selection.

**Acceptance Criteria:**
- [ ] `GET /api/genres` returns array of genre objects
- [ ] Each genre has: `slug`, `name`, `icon`, `movieCount`
- [ ] Genres are hardcoded for MVP (config file)
- [ ] `movieCount` queries actual count from database
- [ ] Response is typed with Zod validation
- [ ] Integration test verifies response shape

**Requirements:** FR-801

**Response Example:**
```json
[
  { "slug": "sci-fi-fantasy", "name": "Sci-Fi/Fantasy", "icon": "rocket", "movieCount": 32 },
  { "slug": "horror", "name": "Horror", "icon": "ghost", "movieCount": 30 }
]
```

**Estimate:** S

---

### Story 1.5: Game Start API Endpoint

**As a** frontend,
**I want** `GET /api/games/start?genre={slug}` to return 10 random movies,
**So that** I can begin a game.

**Acceptance Criteria:**
- [ ] `GET /api/games/start?genre={slug}` returns 10 random movies
- [ ] Movies are randomly selected from the specified genre
- [ ] Response includes only: `imdbId`, `title`, `year`, `posterUrl`
- [ ] Returns 400 if genre slug is invalid
- [ ] Returns 400 if genre has fewer than 10 movies
- [ ] Randomization is server-side (different each request)
- [ ] Integration test verifies 10 movies returned
- [ ] Integration test verifies randomization

**Requirements:** FR-802, FR-804, FR-807, FR-208

**Estimate:** S

---

## Epic 2: Swiss Tournament Engine

**Goal:** Implement the core tournament logic that ranks movies through pairwise comparisons.

**Depends on:** Epic 0 (for testing infrastructure)

**Note:** This is pure frontend logic, heavily unit tested.

---

### Story 2.1: Tournament State Management

**As a** game engine,
**I want** a data structure to track tournament state,
**So that** I can manage rounds, matchups, and standings.

**Acceptance Criteria:**
- [ ] TypeScript types for: `Movie`, `Matchup`, `Standing`, `TournamentState`
- [ ] `TournamentState` tracks: round, comparisons completed, standings
- [ ] `Standing` tracks: movie, wins, losses, opponents faced
- [ ] `createTournament(movies: Movie[])` initializes state for 10 movies
- [ ] State is serializable (for localStorage persistence)
- [ ] Unit tests verify initial state creation

**Requirements:** FR-301, FR-305

**Estimate:** S

---

### Story 2.2: Swiss Pairing Algorithm

**As a** game engine,
**I want** to pair movies with similar records each round,
**So that** rankings converge efficiently.

**Acceptance Criteria:**
- [ ] `generatePairings(state: TournamentState)` returns 5 matchups
- [ ] Movies with same win count are paired together
- [ ] No repeat matchups (same two movies never face twice)
- [ ] If perfect pairing impossible, minimize point differential
- [ ] Unit tests verify pairing logic with various scenarios
- [ ] Unit tests verify no repeat matchups across rounds

**Requirements:** FR-302, FR-303, FR-304

**Estimate:** M

---

### Story 2.3: Tiebreaker Calculations

**As a** game engine,
**I want** to calculate tiebreakers for movies with equal records,
**So that** I can produce a definitive ranking.

**Acceptance Criteria:**
- [ ] `calculateBuchholz(state, movieId)` returns sum of opponents' points
- [ ] `compareMovies(state, movieA, movieB)` returns comparison result
- [ ] Comparison uses: 1) points, 2) head-to-head, 3) Buchholz
- [ ] `getFinalRanking(state)` returns movies ordered 1-10
- [ ] Unit tests for each tiebreaker scenario
- [ ] Unit tests verify stable sorting (deterministic output)

**Requirements:** FR-306, FR-307, FR-309

**Estimate:** M

---

### Story 2.4: Tournament Progression

**As a** game engine,
**I want** to process comparison results and advance rounds,
**So that** the tournament progresses to completion.

**Acceptance Criteria:**
- [ ] `recordResult(state, matchup, winnerId)` updates standings
- [ ] After 5 comparisons, round advances automatically
- [ ] `isComplete(state)` returns true after 4 rounds (20 comparisons)
- [ ] `getNextMatchup(state)` returns current matchup or null if complete
- [ ] Tournament produces valid ranking after completion
- [ ] Unit tests verify full tournament simulation
- [ ] Unit tests verify edge cases (all ties, all sweeps)

**Requirements:** FR-302, FR-305, FR-309

**Estimate:** M

---

## Epic 3: Genre Selection

**Goal:** Implement the genre selection screen where users start a game.

**Depends on:** Epic 1 (for genres API)

---

### Story 3.1: Genre Selection Page

**As a** user,
**I want** to see available genres as tappable cards,
**So that** I can choose what type of movies to rank.

**Acceptance Criteria:**
- [ ] Genre selection is the default/home screen
- [ ] Display 5 genre cards in a responsive grid
- [ ] Each card shows: genre name and icon
- [ ] Cards are keyboard accessible (Tab, Enter)
- [ ] Loading state while fetching genres
- [ ] Error state if API fails with retry option

**Requirements:** FR-101, FR-102, FR-103, NFR-403

**Estimate:** M

---

### Story 3.2: Genre Card Interactions

**As a** user,
**I want** visual feedback when I interact with genre cards,
**So that** the interface feels responsive.

**Acceptance Criteria:**
- [ ] Hover state changes card appearance (desktop)
- [ ] Focus state shows visible outline (accessibility)
- [ ] Touch/click triggers selection animation
- [ ] Selected genre transitions to game screen
- [ ] Cards meet minimum touch target size (44x44px)

**Requirements:** FR-104, FR-105, NFR-304, NFR-406

**Estimate:** S

---

### Story 3.3: Genre Data Fetching

**As a** frontend,
**I want** to fetch genres with TanStack Query,
**So that** I have proper caching and loading states.

**Acceptance Criteria:**
- [ ] TanStack Query configured in app
- [ ] `useGenres()` hook fetches from `/api/genres`
- [ ] Genres are cached (stale-while-revalidate)
- [ ] Loading and error states exposed
- [ ] Refetch on window focus (configurable)

**Requirements:** FR-801

**Estimate:** S

---

## Epic 4: Game Interaction

**Goal:** Implement the core game screen where users make pairwise comparisons.

**Depends on:** Epic 2 (tournament engine), Epic 3 (genre selection flow)

---

### Story 4.1: Game Screen Layout

**As a** user,
**I want** to see two movie posters side by side,
**So that** I can compare and choose my preference.

**Acceptance Criteria:**
- [ ] Game screen displays two movie posters
- [ ] Each poster shows: image, title, year
- [ ] Mobile: stacked or side-by-side (responsive)
- [ ] Desktop: side-by-side with clear separation
- [ ] Poster images lazy load with skeleton placeholder
- [ ] Fallback display if poster image fails to load

**Requirements:** FR-401, FR-402, NFR-203

**Estimate:** M

---

### Story 4.2: Click/Tap Selection

**As a** desktop user,
**I want** to click on my preferred movie,
**So that** I can make my choice easily.

**Acceptance Criteria:**
- [ ] Clicking a poster selects that movie as winner
- [ ] Visual feedback on click (scale, highlight)
- [ ] Selection triggers next matchup after brief delay
- [ ] Keyboard selection with Enter on focused card
- [ ] Cannot select both or neither

**Requirements:** FR-404, FR-406, FR-408

**Estimate:** S

---

### Story 4.3: Swipe Gestures (Mobile)

**As a** mobile user,
**I want** to swipe left or right to choose,
**So that** I can play quickly with one hand.

**Acceptance Criteria:**
- [ ] Detect touch device vs pointer device
- [ ] Swipe right = select right movie, swipe left = select left
- [ ] Swipe threshold prevents accidental selection
- [ ] Visual feedback during swipe (card follows finger)
- [ ] Swipe animation completes selection
- [ ] Works in portrait orientation

**Requirements:** FR-403, FR-405, NFR-303, NFR-305

**Estimate:** L

---

### Story 4.4: Progress Indicator

**As a** user,
**I want** to see how far through the game I am,
**So that** I know how many choices remain.

**Acceptance Criteria:**
- [ ] Progress bar or dots show completion percentage
- [ ] Updates after each comparison
- [ ] Visual only - no text like "5 of 20"
- [ ] Positioned unobtrusively (top or bottom)
- [ ] Animates smoothly between states

**Requirements:** FR-409, FR-410

**Estimate:** S

---

### Story 4.5: Comparison Transitions

**As a** user,
**I want** smooth animations between comparisons,
**So that** the game feels polished and responsive.

**Acceptance Criteria:**
- [ ] Selected movie animates (grows, highlights)
- [ ] Non-selected movie fades or shrinks
- [ ] New matchup slides or fades in
- [ ] Transition completes in < 300ms
- [ ] Respects `prefers-reduced-motion`
- [ ] No animation jank or frame drops

**Requirements:** FR-407, NFR-103, NFR-405

**Estimate:** M

---

## Epic 5: Results & Commentary

**Goal:** Display the final ranking with playful commentary after tournament completion.

**Depends on:** Epic 4 (game flow)

---

### Story 5.1: Results Screen Layout

**As a** user,
**I want** to see my final ranking from #1 to #10,
**So that** I know my preferences.

**Acceptance Criteria:**
- [ ] Results screen displays after tournament completes
- [ ] Ranked list shows position, poster thumbnail, title, year
- [ ] #1 is visually emphasized (larger, highlighted)
- [ ] List is scrollable if needed
- [ ] Smooth transition from game screen

**Requirements:** FR-501, FR-502

**Estimate:** M

---

### Story 5.2: Commentary Generation

**As a** user,
**I want** playful commentary on my ranking,
**So that** the results are entertaining.

**Acceptance Criteria:**
- [ ] Generate 2-3 commentary lines per game
- [ ] Identify "upsets" (lower-seed beating higher-seed)
- [ ] Identify surprising #1 or #10 picks
- [ ] Commentary is playful, not judgmental
- [ ] Different templates for variety
- [ ] Unit tests for commentary logic

**Requirements:** FR-503, FR-504, FR-505

**Commentary Examples:**
- "You chose Fast & Furious over Citizen Kane. Bold move."
- "Shrek at #1? A person of culture."
- "Horror at #10... maybe stick to comedies?"

**Estimate:** M

---

### Story 5.3: Play Again Flow

**As a** user,
**I want** to easily start a new game,
**So that** I can play again with different movies.

**Acceptance Criteria:**
- [ ] "Play Again" button prominently displayed
- [ ] Button returns to genre selection
- [ ] Current game state cleared on Play Again
- [ ] Session tracking preserved (seen movies)
- [ ] Button is keyboard accessible

**Requirements:** FR-506, FR-507

**Estimate:** S

---

### Story 5.4: Game Timer (Optional)

**As a** user,
**I want** to see how long I took to complete the game,
**So that** I can try to beat my time.

**Acceptance Criteria:**
- [ ] Timer starts when game begins
- [ ] Timer stops when tournament completes
- [ ] Display format: "Completed in X:XX"
- [ ] Timer not visible during gameplay (distraction)

**Requirements:** FR-508

**Priority:** Could (implement if time permits)

**Estimate:** S

---

## Epic 6: Session Persistence

**Goal:** Save and restore game state so users can resume interrupted games.

**Depends on:** Epic 4 (game state exists)

---

### Story 6.1: Zustand Store Setup

**As a** developer,
**I want** game state managed in Zustand,
**So that** state is centralized and testable.

**Acceptance Criteria:**
- [ ] Zustand store created with game state shape
- [ ] Actions: `selectGenre`, `makeChoice`, `playAgain`, `abandonGame`
- [ ] State includes: status, genre, movies, tournament state, results
- [ ] Store is typed with TypeScript
- [ ] Unit tests for state transitions

**Requirements:** ADR-003

**Estimate:** M

---

### Story 6.2: localStorage Persistence

**As a** user,
**I want** my game saved automatically,
**So that** I can resume if I close the browser.

**Acceptance Criteria:**
- [ ] Zustand persist middleware saves to localStorage
- [ ] State saved after each comparison
- [ ] Only necessary fields persisted (not derived state)
- [ ] State restored on page load
- [ ] Graceful handling if localStorage unavailable

**Requirements:** FR-601, FR-602, FR-603

**Estimate:** S

---

### Story 6.3: Resume Game Prompt

**As a** user,
**I want** to be asked if I want to resume my saved game,
**So that** I don't accidentally lose progress.

**Acceptance Criteria:**
- [ ] On load, detect saved in-progress game
- [ ] Show modal: "Resume your game?" with Resume/New Game options
- [ ] Resume restores exact game state
- [ ] New Game clears state, goes to genre selection
- [ ] Modal is accessible (focus trap, keyboard)

**Requirements:** FR-604

**Estimate:** M

---

### Story 6.4: Session Movie Tracking

**As a** user,
**I want** to avoid seeing the same movies across multiple games,
**So that** each game feels fresh.

**Acceptance Criteria:**
- [ ] Track `seenMovieIds` in session state
- [ ] Pass seen IDs to API (or filter client-side)
- [ ] Session resets after 1 hour of inactivity
- [ ] Clear session on explicit user action (optional)
- [ ] Graceful fallback if pool exhausted (allow repeats with warning)

**Requirements:** FR-209, FR-606, FR-607

**Estimate:** M

---

## Epic 7: Polish & Accessibility

**Goal:** Final polish, accessibility compliance, and edge case handling.

**Depends on:** All previous epics

---

### Story 7.1: Keyboard Navigation

**As a** keyboard user,
**I want** to play the entire game without a mouse,
**So that** the game is accessible.

**Acceptance Criteria:**
- [ ] All interactive elements focusable via Tab
- [ ] Focus order is logical
- [ ] Enter/Space activates focused element
- [ ] Arrow keys navigate within groups (genre cards, movie cards)
- [ ] Focus indicators visible on all elements
- [ ] Skip link to main content (optional)

**Requirements:** NFR-403, NFR-406

**Estimate:** M

---

### Story 7.2: Screen Reader Support

**As a** screen reader user,
**I want** all content announced properly,
**So that** I can play the game.

**Acceptance Criteria:**
- [ ] All images have alt text (movie titles)
- [ ] Buttons have accessible names
- [ ] Live regions announce game progress
- [ ] Results list uses semantic markup
- [ ] Tested with VoiceOver (Mac) or NVDA (Windows)

**Requirements:** NFR-404

**Estimate:** M

---

### Story 7.3: Reduced Motion Support

**As a** user with motion sensitivity,
**I want** animations disabled when I prefer,
**So that** I can use the app comfortably.

**Acceptance Criteria:**
- [ ] Detect `prefers-reduced-motion` media query
- [ ] Replace animations with instant transitions
- [ ] Swipe still works but without animation
- [ ] Progress bar updates without animation

**Requirements:** NFR-405

**Estimate:** S

---

### Story 7.4: Error States and Edge Cases

**As a** user,
**I want** graceful handling of errors,
**So that** I'm not stuck or confused.

**Acceptance Criteria:**
- [ ] API errors show friendly message with retry
- [ ] Image load failures show placeholder
- [ ] Network offline shows appropriate message
- [ ] Corrupted localStorage prompts fresh start
- [ ] Empty genre (< 10 movies) handled gracefully

**Requirements:** E-100, E-200, E-300

**Estimate:** M

---

## Story Estimation Key

| Size | Description | Rough Hours |
|------|-------------|-------------|
| S | Small, straightforward | 1-2 hours |
| M | Medium, some complexity | 2-4 hours |
| L | Large, significant complexity | 4-8 hours |
| XL | Extra large, consider splitting | 8+ hours |

---

## Implementation Order

**Recommended sequence:**

```
Phase 1: Foundation (Epic 0)
  0.1 → 0.2 → 0.3 → 0.4 → 0.5 → 0.6

Phase 2: Backend (Epic 1) + Tournament Logic (Epic 2) - Parallel
  1.1 → 1.2 → 1.3 → 1.4 → 1.5
  2.1 → 2.2 → 2.3 → 2.4

Phase 3: Frontend Flow (Epics 3, 4, 5) - Sequential
  3.1 → 3.2 → 3.3
  4.1 → 4.2 → 4.3 → 4.4 → 4.5
  5.1 → 5.2 → 5.3 → 5.4

Phase 4: Persistence (Epic 6)
  6.1 → 6.2 → 6.3 → 6.4

Phase 5: Polish (Epic 7)
  7.1 → 7.2 → 7.3 → 7.4
```

---

## Traceability Matrix

| Epic | Primary Requirements |
|------|---------------------|
| E0 | ADR-001, NFR-701, NFR-704, NFR-705, NFR-706, NFR-707 |
| E1 | FR-201-210, FR-801-807, FR-901-907 |
| E2 | FR-301-309 |
| E3 | FR-101-106 |
| E4 | FR-401-410 |
| E5 | FR-501-508 |
| E6 | FR-601-607 |
| E7 | NFR-401-407, E-100, E-200, E-300 |

---

## Next Steps

1. Initialize sprint tracking with `/status-update`
2. Begin implementation with Story 0.1
3. Each story follows TDD: write tests first, implement, refactor

---

*Generated via story planning session*
