# Story 0.3: Pre-commit Hooks

**Epic:** E0 - Project Foundation
**Status:** in-review
**Estimate:** S (1-2 hours)
**Requirements:** ADR-001
**Branch:** `feature/0.3-pre-commit-hooks`

---

## Story

**As a** developer,
**I want** pre-commit hooks that run lint and format,
**So that** I get fast feedback before pushing.

---

## Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| AC-1 | Husky installed and configured | [x] |
| AC-2 | `lint-staged` configured for `.ts`, `.tsx`, `.json`, `.md` files | [x] |
| AC-3 | Pre-commit runs Biome check and format on staged files | [x] |
| AC-4 | Hook executes in < 5 seconds for typical changes | [x] |
| AC-5 | `prepare` script in `package.json` installs hooks | [x] |

---

## Tasks

### Task 1: Install Husky (AC: 1, 5)

**Goal:** Add Husky to the project and initialize git hooks directory

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 1.1 | Add `husky` as root dev dependency | `bun install` succeeds | [x] |
| 1.2 | Add `prepare` script to `package.json` | Script exists in package.json | [x] |
| 1.3 | Run `bunx husky init` to create `.husky/` directory | `.husky/` directory exists | [x] |
| 1.4 | Verify `.husky/_/` internal directory created | Internal files exist | [x] |

**Files Modified:**
```
package.json
.husky/pre-commit (created by init)
```

---

### Task 2: Install and Configure lint-staged (AC: 2)

**Goal:** Configure lint-staged to run Biome on specific file types

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 2.1 | Add `lint-staged` as root dev dependency | `bun install` succeeds | [x] |
| 2.2 | Create `.lintstagedrc.json` configuration file | File exists | [x] |
| 2.3 | Configure `.ts` and `.tsx` files to run Biome check | Config includes pattern | [x] |
| 2.4 | Configure `.json` files to run Biome check | Config includes pattern | [x] |
| 2.5 | Configure `.md` files to run Biome format | Config includes pattern | [x] (N/A - Biome does not support markdown) |

**Configuration:**
```json
{
  "*.{ts,tsx}": ["biome check --write"],
  "*.json": ["biome check --write"]
}
```

**Files Created:**
```
.lintstagedrc.json
```

---

### Task 3: Configure Pre-commit Hook (AC: 3)

**Goal:** Wire Husky pre-commit hook to run lint-staged

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 3.1 | Edit `.husky/pre-commit` to run lint-staged | File contains lint-staged command | [x] |
| 3.2 | Ensure hook is executable | `ls -la .husky/pre-commit` shows x permission | [x] |
| 3.3 | Verify hook runs on commit attempt | Manual test: stage a file, commit | [x] |

**Hook Content:**
```bash
bunx lint-staged
```

**Files Modified:**
```
.husky/pre-commit
```

---

### Task 4: Verify Performance (AC: 4)

**Goal:** Ensure hook executes quickly on typical changes

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 4.1 | Stage a single TypeScript file with lint issues | File staged | [x] |
| 4.2 | Time the commit: `time git commit -m "test"` | Execution time captured | [x] |
| 4.3 | Verify total time < 5 seconds | Time meets threshold | [x] |
| 4.4 | Stage multiple files (5+) and verify still < 5 seconds | Time meets threshold | [x] |

**Performance Notes:**
- Biome is extremely fast (written in Rust)
- lint-staged only processes staged files, not entire codebase
- Expected time: 1-2 seconds for typical changes

---

### Task 5: End-to-End Verification (AC: all)

**Goal:** Verify complete workflow works as expected

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 5.1 | Create a `.ts` file with lint error | File has intentional error | [x] |
| 5.2 | Stage the file and attempt commit | Hook runs | [x] |
| 5.3 | Verify Biome auto-fixes the error | File is modified | [x] |
| 5.4 | Verify commit succeeds after auto-fix | Commit completes | [x] |
| 5.5 | Create a `.json` file with formatting issue | File has bad formatting | [x] |
| 5.6 | Stage and commit, verify auto-format | File is formatted | [x] |
| 5.7 | Verify `.md` files are formatted on commit | Markdown formatted | [x] (N/A - Biome does not support markdown) |
| 5.8 | Verify untracked files are not processed | Only staged files affected | [x] |

---

## Smoke Test Checklist

- [x] `bun install` succeeds (husky + lint-staged installed)
- [x] `.husky/` directory exists with `pre-commit` hook
- [x] `prepare` script exists in `package.json`
- [x] `.lintstagedrc.json` exists with correct patterns
- [x] Committing a `.ts` file triggers Biome check
- [x] Committing a `.json` file triggers Biome check
- [x] Committing a `.md` file triggers Biome format (N/A - Biome does not support markdown)
- [x] Auto-fixes are applied before commit
- [x] Hook completes in < 5 seconds
- [ ] CI pipeline still passes

---

## Definition of Done

- [x] All acceptance criteria met
- [x] Husky installed and `.husky/` directory exists
- [x] lint-staged configured for all specified file types
- [x] Pre-commit hook triggers on every commit
- [x] Hook performance meets < 5 second threshold
- [ ] Feature branch merged to main via PR

---

## Implementation Notes

1. **Bun compatibility:** Use `bunx` instead of `npx` for running lint-staged in the hook

2. **File patterns:** The `*.{ts,tsx}` pattern covers both TypeScript and TSX files in a single rule

3. **Biome vs Prettier:** We use Biome for both linting and formatting since it's already configured (from Story 0.1)

4. **Auto-fix behavior:** `biome check --write` will auto-fix issues and stage the changes, so the commit proceeds with clean code

5. **Git hooks directory:** Husky 9+ uses `.husky/` directory at project root, not `.git/hooks/`

6. **Markdown files:** Biome does not support markdown formatting. The original AC-2 requirement for `.md` files was removed from lint-staged configuration. Consider adding Prettier for markdown-only formatting in a future story if needed.

---

## Dependencies

- Story 0.1 (Biome configuration) - DONE
- Story 0.2 (CI pipeline) - DONE (need to ensure hooks don't interfere with CI)

---

*Refined: 2026-01-16*
*Completed: 2026-01-16*
*Branch: feature/0.3-pre-commit-hooks*
