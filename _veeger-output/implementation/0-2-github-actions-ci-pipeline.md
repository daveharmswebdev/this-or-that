# Story 0.2: GitHub Actions CI Pipeline

**Epic:** E0 - Project Foundation
**Status:** done
**Estimate:** M (2-4 hours)
**Requirements:** ADR-001, NFR-701
**PR:** https://github.com/daveharmswebdev/this-or-that/pull/1

---

## Story

**As a** developer,
**I want** a GitHub Actions workflow that runs lint, typecheck, and tests,
**So that** broken code cannot merge to main.

---

## Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| AC-1 | `.github/workflows/ci.yml` created | [x] |
| AC-2 | CI triggers on PR to main and push to main | [x] |
| AC-3 | Lint job runs Biome check | [x] |
| AC-4 | Typecheck job runs `tsc --noEmit` | [x] |
| AC-5 | Unit test job runs Vitest (placeholder test passes) | [x] |
| AC-6 | Integration test job with Postgres service container | [x] |
| AC-7 | Build job verifies `bun run build` succeeds | [x] |
| AC-8 | All jobs run in parallel where possible | [x] |
| AC-9 | CI badge added to README | [x] |

---

## Tasks

### Task 1: Install Vitest and Create Placeholder Tests (AC: 5, 6) - DONE

**Goal:** Minimal Vitest setup so CI has tests to run

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 1.1 | Add `vitest` as root dev dependency | `bun install` succeeds | [x] |
| 1.2 | Create `vitest.config.ts` at root with basic config | File exists | [x] |
| 1.3 | Add test scripts to root `package.json` | Scripts exist | [x] |
| 1.4 | Create `apps/api/src/__tests__/placeholder.test.ts` | File exists | [x] |
| 1.5 | Create `apps/web/src/__tests__/placeholder.test.ts` | File exists | [x] |
| 1.6 | Verify `bun run test:unit` passes | Exit code 0 | [x] |

**Files Created:**
```
vitest.config.ts
vitest.config.unit.ts
vitest.config.integration.ts
apps/api/src/__tests__/placeholder.test.ts
apps/web/src/__tests__/placeholder.test.ts
```

---

### Task 2: Create Integration Test Infrastructure (AC: 6) - DONE

**Goal:** Placeholder integration test that verifies Postgres connection

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 2.1 | Add `pg` package to `apps/api` for raw Postgres connection | In dependencies | [x] |
| 2.2 | Create `apps/api/src/__tests__/db.integration.test.ts` | File exists | [x] |
| 2.3 | Integration test connects to Postgres and runs `SELECT 1` | Test passes with DB | [x] |
| 2.4 | Add `test:integration` script that filters integration tests | Script works | [x] |
| 2.5 | Verify integration test skips gracefully if no DB (local dev) | No crash without DB | [x] |

**Files Created:**
```
apps/api/src/__tests__/db.integration.test.ts
```

---

### Task 3: Create GitHub Actions Workflow (AC: 1, 2, 3, 4, 5, 6, 7, 8) - DONE

**Goal:** Complete CI pipeline with all jobs

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 3.1 | Create `.github/workflows/` directory | Directory exists | [x] |
| 3.2 | Create `ci.yml` with workflow name and triggers | File exists | [x] |
| 3.3 | Add `lint` job using Bun and Biome | Job defined | [x] |
| 3.4 | Add `typecheck` job running tsc | Job defined | [x] |
| 3.5 | Add `test-unit` job running Vitest unit tests | Job defined | [x] |
| 3.6 | Add `test-integration` job with Postgres service | Job defined with service | [x] |
| 3.7 | Add `build` job running `bun run build` | Job defined | [x] |
| 3.8 | Verify all jobs run in parallel (no dependencies) | Jobs independent | [x] |

**File Created:**
```
.github/workflows/ci.yml
```

---

### Task 4: Add CI Badge to README (AC: 9) - DONE

**Goal:** Show CI status in repository README

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 4.1 | Add CI status badge to top of README.md | Badge visible | [x] |
| 4.2 | Badge links to Actions tab | Link works | [x] |

---

### Task 5: Verify CI Pipeline End-to-End (AC: all) - DONE

**Goal:** Push to feature branch, verify all jobs pass

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 5.1 | Commit all changes to feature branch | Clean commit | [x] |
| 5.2 | Push feature branch | Push succeeds | [x] |
| 5.3 | Open PR to main | PR created | [x] |
| 5.4 | Verify all 5 CI jobs run | Jobs visible in Actions | [x] |
| 5.5 | Verify all jobs pass (green) | All checks pass | [x] |
| 5.6 | Verify jobs ran in parallel | Timing shows parallelism | [x] |

---

## Smoke Test Checklist

- [x] `bun run lint` passes locally
- [x] `bun run typecheck` passes locally
- [x] `bun run test:unit` passes locally
- [x] `bun run build` passes locally
- [x] PR to main triggers CI
- [x] All 5 CI jobs visible in Actions tab
- [x] All jobs pass (green checkmarks)
- [x] CI badge visible in README
- [x] Badge shows "passing" status (after merge)

---

## Definition of Done

- [x] All acceptance criteria met
- [x] CI workflow file committed
- [x] All 5 jobs pass on PR
- [x] Badge shows in README
- [x] Feature branch merged to main via PR

---

## Implementation Notes

1. **Separate vitest configs:** Created `vitest.config.unit.ts` and `vitest.config.integration.ts` for cleaner separation of test types.

2. **Integration test skip logic:** Uses `describe.skip` when `DATABASE_URL` is not set, allowing local dev without Docker.

3. **Fixed bun-types issue:** Changed tsconfig from `bun-types` to `@types/bun` to match installed package.

4. **Fixed workspace build scripts:** Bun doesn't support `--filter '*'` syntax, so changed to explicit `--cwd` calls.

---

*Implemented: 2026-01-15*
*PR: https://github.com/daveharmswebdev/this-or-that/pull/1*
*Merged: 2026-01-16*
*Reviewed: 2026-01-16 (post-merge review)*
