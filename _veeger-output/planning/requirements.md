# Versus - Requirements Specification

**Author:** Walt Harms
**Date:** 2026-01-15
**Version:** 1.1
**Status:** Draft

---

## Document Purpose

This document specifies the functional and non-functional requirements for Versus, a movie preference ranking game using Swiss tournament pairwise comparisons.

---

## Assumptions & Decisions

The following assumptions and architectural decisions were made during requirements discovery:

1. **Swiss Tournament Implementation:** Modified Swiss with 4 rounds (20 comparisons max for 10 items), terminating early if clear ranking emerges
2. **Tie-Breaking:** Head-to-head result wins; if no head-to-head, use point differential from opponents' performance (Buchholz scoring)
3. **Movie Selection:** Movies can appear in multiple genre pools, but user won't see duplicates within a single session even across multiple games
4. **Error Handling:** Graceful degradation - database fallbacks, placeholder images, clear error messaging
5. **Accessibility:** WCAG 2.1 AA compliance target
6. **Infrastructure:** Render for hosting (Bun backend + static frontend), PostgreSQL on existing Render instance using dedicated `versus` schema
7. **ORM:** Drizzle with PostgreSQL driver, migrations managed via Drizzle Kit
8. **OMDB Tier:** Standard Patreon ($5/month) - 250,000 requests/day + Poster API access
9. **Caching Strategy:** Server-side database persistence - fetch from OMDB once per movie, store permanently, never re-fetch

---

## Functional Requirements

### FR-100: Genre Selection

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-101 | System shall display exactly 5 genre options on the selection screen | Must |
| FR-102 | Genre options shall be: Sci-Fi/Fantasy, Horror, Animation, Action, Rom-Com | Must |
| FR-103 | Each genre shall be displayed as a tappable card with visual identity | Must |
| FR-104 | User shall select exactly one genre to initiate a game | Must |
| FR-105 | System shall provide visual feedback on genre hover/focus state | Should |
| FR-106 | Genre cards shall display a representative image or icon | Should |

### FR-200: Movie Data Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-201 | System shall maintain a curated list of movies per genre in PostgreSQL database | Must |
| FR-202 | Each genre shall contain minimum 30 movies at launch | Must |
| FR-203 | Movie records shall include: IMDB ID, title, year, poster URL, genres (array), and fetch timestamp | Must |
| FR-204 | Backend API shall serve movie data to frontend via REST endpoints | Must |
| FR-205 | Backend shall fetch from OMDB API only when movie does not exist in database | Must |
| FR-206 | Backend shall store OMDB response permanently after successful fetch | Must |
| FR-207 | Backend shall never re-fetch a movie that already exists in database | Must |
| FR-208 | System shall randomly select 10 movies from chosen genre pool | Must |
| FR-209 | Frontend shall exclude movies already seen in current session from selection | Should |
| FR-210 | Movies may belong to multiple genres (stored as array in database) | Must |

### FR-300: Swiss Tournament Engine

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-301 | System shall implement Swiss tournament pairing algorithm | Must |
| FR-302 | Tournament shall consist of up to 4 rounds with 5 matches per round | Must |
| FR-303 | System shall pair movies with similar win/loss records each round | Must |
| FR-304 | System shall prevent repeat matchups (same two movies facing twice) | Must |
| FR-305 | System shall track cumulative points: 1 point per win, 0 per loss | Must |
| FR-306 | System shall calculate Buchholz score (sum of opponents' points) for tiebreaking | Must |
| FR-307 | System shall use head-to-head result as primary tiebreaker | Must |
| FR-308 | System shall terminate tournament early if all rankings are mathematically determined | Could |
| FR-309 | System shall produce final ranking 1-10 based on points, then tiebreakers | Must |

### FR-400: Game Interaction

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-401 | System shall display two movie posters side-by-side for each comparison | Must |
| FR-402 | System shall display movie title and year beneath each poster | Must |
| FR-403 | On touch devices, user shall swipe left or right to select preferred movie | Must |
| FR-404 | On pointer devices, user shall click on preferred movie to select | Must |
| FR-405 | System shall detect input type and enable appropriate interaction mode | Must |
| FR-406 | System shall provide immediate visual feedback on selection | Must |
| FR-407 | System shall animate transition between comparisons | Should |
| FR-408 | User shall not be able to skip a comparison or select "tie" | Must |
| FR-409 | System shall display progress indicator showing completion percentage | Must |
| FR-410 | Progress indicator shall be visual only (bar or dots), no text | Should |

### FR-500: Results Display

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-501 | System shall display final ranking as numbered list #1 through #10 | Must |
| FR-502 | Each ranked item shall show poster thumbnail, title, and year | Must |
| FR-503 | System shall generate commentary on 2-3 notable ranking observations | Must |
| FR-504 | Commentary shall highlight surprising picks (e.g., upset victories) | Must |
| FR-505 | Commentary tone shall be playful and non-judgmental | Must |
| FR-506 | System shall display "Play Again" button prominently | Must |
| FR-507 | "Play Again" shall return user to genre selection | Must |
| FR-508 | System shall display time taken to complete game | Could |

### FR-600: Session Persistence

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-601 | System shall save game state to localStorage after each comparison | Must |
| FR-602 | Game state shall include: selected genre, movie list, tournament state, comparison history | Must |
| FR-603 | System shall restore in-progress game on page load if valid state exists | Must |
| FR-604 | System shall prompt user to resume or start new game when saved state exists | Should |
| FR-605 | System shall clear game state upon reaching results screen | Must |
| FR-606 | System shall track movies seen in current session to prevent repeats across games | Should |
| FR-607 | Session tracking shall reset after 1 hour of inactivity | Should |

### FR-700: Navigation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-701 | System shall provide a way to abandon current game and return to genre selection | Should |
| FR-702 | Abandoning game shall prompt for confirmation | Should |
| FR-703 | System shall handle browser back button gracefully | Should |
| FR-704 | Deep linking to specific screens shall not be supported (MVP) | N/A |

### FR-800: Backend API

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-801 | Backend shall expose `GET /api/genres` endpoint returning available genres | Must |
| FR-802 | Backend shall expose `GET /api/movies?genre={genre}` endpoint returning movies for a genre | Must |
| FR-803 | Backend shall expose `GET /api/movies/:imdbId` endpoint returning single movie details | Should |
| FR-804 | API responses shall return only necessary fields (id, title, year, posterUrl, genres) | Should |
| FR-805 | Backend shall handle OMDB fetch failures gracefully with appropriate error responses | Must |
| FR-806 | Backend shall log OMDB API calls for monitoring | Should |
| FR-807 | API shall return randomized movie selection (10 movies) for game start | Must |

### FR-900: Data Seeding & Administration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-901 | System shall support seeding movies via CLI script | Must |
| FR-902 | Seed script shall accept IMDB IDs and genre assignments as input | Must |
| FR-903 | Seed script shall fetch movie data from OMDB and populate database | Must |
| FR-904 | Seed script shall be idempotent (re-running does not create duplicates) | Must |
| FR-905 | System shall support adding new movies without code deployment | Should |
| FR-906 | Seed script shall report success/failure for each movie processed | Should |
| FR-907 | Seed script shall validate IMDB ID format before calling OMDB | Should |

---

## Non-Functional Requirements

### NFR-100: Performance

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-101 | Initial page load (First Contentful Paint) | < 1.5 seconds on 4G | Must |
| NFR-102 | Time to Interactive | < 3 seconds on 4G | Must |
| NFR-103 | Comparison transition animation | < 300ms | Must |
| NFR-104 | Backend API response time | < 200ms for cached data | Should |
| NFR-105 | Total JavaScript bundle size | < 200KB gzipped | Should |
| NFR-106 | Poster image load time | < 2 seconds each | Should |

### NFR-200: Reliability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-201 | Game state recovery after page reload | 100% when localStorage available | Must |
| NFR-202 | Graceful handling of backend API failures | Show error message, allow retry | Must |
| NFR-203 | Graceful handling of image load failures | Display placeholder with movie title | Must |
| NFR-204 | Application uptime | 99% (Render SLA) | Should |
| NFR-205 | Database connection pool management | Handle connection limits gracefully | Should |

### NFR-300: Usability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-301 | Complete game without instructions | 90% of first-time users | Must |
| NFR-302 | Average game completion time | 2-3 minutes | Should |
| NFR-303 | Swipe gesture recognition accuracy | > 95% | Must |
| NFR-304 | Minimum touch target size | 44x44 pixels | Must |
| NFR-305 | Support for one-handed mobile use | Portrait orientation optimized | Should |

### NFR-400: Accessibility (WCAG 2.1 AA Target)

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-401 | Color contrast ratio for text | Minimum 4.5:1 | Must |
| NFR-402 | Color contrast ratio for UI components | Minimum 3:1 | Must |
| NFR-403 | Keyboard navigation support | Full game playable via keyboard | Must |
| NFR-404 | Screen reader compatibility | All interactive elements labeled | Must |
| NFR-405 | Reduced motion support | Respect prefers-reduced-motion | Should |
| NFR-406 | Focus indicators | Visible on all interactive elements | Must |
| NFR-407 | Text resizing | Readable at 200% zoom | Should |

### NFR-500: Compatibility

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-501 | Mobile browser support | iOS Safari 15+, Chrome Android 100+ | Must |
| NFR-502 | Desktop browser support | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ | Must |
| NFR-503 | Minimum screen width | 320px (iPhone SE) | Must |
| NFR-504 | Maximum screen width | Graceful scaling to 2560px | Should |
| NFR-505 | Offline capability | Display error message, no offline mode (MVP) | N/A |

### NFR-600: Security

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-601 | HTTPS enforcement | All traffic over TLS 1.2+ | Must |
| NFR-602 | OMDB API key stored as environment variable | Server-side only, never in client | Must |
| NFR-603 | Content Security Policy | Strict CSP headers | Should |
| NFR-604 | Input sanitization | All dynamic content escaped | Must |
| NFR-605 | Database credentials | Stored in Render environment, never in code | Must |
| NFR-606 | API rate limiting | Prevent abuse of backend endpoints | Should |

### NFR-700: Maintainability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-701 | Code test coverage | > 70% for core logic (tournament engine) | Should |
| NFR-702 | Component documentation | Props documented for all React components | Should |
| NFR-703 | Genre/movie list updates | Manageable via seed script without code changes | Should |
| NFR-704 | TypeScript usage | Strict mode, no implicit any | Should |
| NFR-705 | Database migrations | Version-controlled via Drizzle Kit, repeatable | Must |
| NFR-706 | Schema isolation | Dedicated `versus` schema in shared PostgreSQL instance | Must |
| NFR-707 | Environment configuration | All config via environment variables | Must |

---

## Error Handling Specifications

### E-100: Backend API Errors

| Scenario | Behavior |
|----------|----------|
| Backend API timeout (>5s) | Retry once, then show error with retry option |
| Backend API 500 error | Show friendly error message, log details server-side |
| Network offline | Show offline message, disable game start |
| OMDB fetch failure (during seed) | Log error, continue with next movie, report at end |

### E-200: Storage Errors

| Scenario | Behavior |
|----------|----------|
| localStorage unavailable | Warn user that progress won't be saved, allow play |
| localStorage quota exceeded | Clear session tracking data, retry save |
| Corrupted game state | Clear state, prompt to start new game |
| Database connection failure | Return 503, frontend shows maintenance message |

### E-300: Asset Errors

| Scenario | Behavior |
|----------|----------|
| Poster image 404 | Display placeholder with movie title on solid color |
| Poster image slow (>3s) | Show loading skeleton, continue displaying on load |
| Both posters fail | Allow comparison with title/year only display |

---

## Data Model

### Movies Table (`versus.movies`)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Internal ID |
| imdb_id | VARCHAR(12) | UNIQUE, NOT NULL | IMDB identifier (e.g., tt0111161) |
| title | VARCHAR(255) | NOT NULL | Movie title |
| year | VARCHAR(10) | NOT NULL | Release year |
| poster_url | TEXT | | Full URL to poster image |
| genres | TEXT[] | NOT NULL | Array of genre tags |
| fetched_at | TIMESTAMP | NOT NULL | When data was fetched from OMDB |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |

### Genres Table (`versus.genres`) - Optional

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Internal ID |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | URL-safe identifier |
| name | VARCHAR(100) | NOT NULL | Display name |
| icon | VARCHAR(50) | | Icon identifier |
| sort_order | INTEGER | DEFAULT 0 | Display order |

---

## Glossary

| Term | Definition |
|------|------------|
| Swiss Tournament | A non-elimination tournament format where participants are paired with opponents of similar records |
| Buchholz Score | Tiebreaker calculated as the sum of all opponents' points |
| Comparison | A single "this or that" decision between two movies |
| Round | A set of 5 comparisons where each movie plays once |
| Session | A user's continuous interaction, tracked for preventing repeat movies |
| Seed Script | CLI tool to populate database with movie data from OMDB |
| OMDB | Open Movie Database - third-party API for movie metadata |

---

## Traceability

| Requirement | PRD Reference |
|-------------|---------------|
| FR-100 series | MVP: Genre selection screen |
| FR-200 series | MVP: OMDB API integration (now via backend) |
| FR-300 series | MVP: Swiss tournament comparison engine |
| FR-400 series | MVP: Swipe gestures / Click interaction |
| FR-500 series | MVP: Results screen |
| FR-600 series | MVP: Session persistence |
| FR-800 series | Technical: Backend API layer |
| FR-900 series | Technical: Data seeding |
| NFR-400 series | Design Direction: Accessibility implied |
| NFR-700 series | Technical: Infrastructure decisions |

---

## Next Steps

1. Run `/plan-arch` to document technical architecture decisions
2. Run `/plan-stories` to break requirements into implementable user stories

---

*Generated via requirements specification session*
*Version 1.1 - Updated with server-side persistence architecture*
