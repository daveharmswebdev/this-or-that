# Story 0.1: Repository and Monorepo Setup

**Epic:** E0 - Project Foundation
**Status:** done
**Estimate:** S (1-2 hours)
**Completed:** 2026-01-15
**Requirements:** NFR-704, NFR-707

---

## User Story

**As a** developer,
**I want** a properly configured monorepo with Bun workspaces,
**So that** I have a clean foundation for backend and frontend code.

---

## Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| AC-1 | Git repository initialized with `.gitignore` | [x] |
| AC-2 | `package.json` at root with Bun workspaces configured | [x] |
| AC-3 | `apps/api/` directory with `package.json` for Hono backend | [x] |
| AC-4 | `apps/web/` directory with `package.json` for React frontend | [x] |
| AC-5 | `tsconfig.json` with strict mode, path aliases configured | [x] |
| AC-6 | `biome.json` with lint and format rules | [x] |
| AC-7 | `README.md` with project overview and setup instructions | [x] |

---

## Tasks

### Task 1: Initialize Git Repository

**Goal:** Create git repository with proper ignore patterns

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 1.1 | Initialize git repository | `git status` succeeds | [x] |
| 1.2 | Create `.gitignore` with Node/Bun patterns | File exists with required patterns | [x] |
| 1.3 | Create initial commit | `git log` shows commit | [x] |

**Verification:**
```bash
git status
git log --oneline -1
cat .gitignore | grep -E "node_modules|dist|.env"
```

**Acceptance Criteria:** AC-1

---

### Task 2: Create Root Package Configuration

**Goal:** Set up Bun workspace root with proper metadata

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 2.1 | Create root `package.json` with project name "versus" | File exists with correct name | [x] |
| 2.2 | Configure Bun workspaces pointing to `apps/*` | `workspaces` array includes `apps/*` | [x] |
| 2.3 | Set `private: true` to prevent accidental publish | Field exists and is true | [x] |
| 2.4 | Add placeholder scripts | `dev`, `build`, `lint`, `typecheck` scripts exist | [x] |

**File:** `package.json`

**Verification:**
```bash
bun install  # Should recognize workspaces
cat package.json | grep -A2 '"workspaces"'
```

**Acceptance Criteria:** AC-2

---

### Task 3: Create API Workspace

**Goal:** Set up Hono backend workspace with dependencies

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 3.1 | Create `apps/api/` directory structure | Directory exists | [x] |
| 3.2 | Create `apps/api/package.json` with name `@versus/api` | Package name correct | [x] |
| 3.3 | Add Hono dependency | Hono in dependencies | [x] |
| 3.4 | Add TypeScript and @types/bun as dev dependencies | In devDependencies | [x] |
| 3.5 | Create `apps/api/src/` directory | Directory exists | [x] |
| 3.6 | Create placeholder `apps/api/src/index.ts` | File exists, exports something | [x] |
| 3.7 | Add scripts: `dev`, `build`, `start` | Scripts defined | [x] |

**File:** `apps/api/package.json`

**Verification:**
```bash
ls apps/api/src/index.ts
cat apps/api/package.json | grep hono
```

**Acceptance Criteria:** AC-3

---

### Task 4: Create Web Workspace

**Goal:** Set up React/Vite frontend workspace with dependencies

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 4.1 | Create `apps/web/` directory structure | Directory exists | [x] |
| 4.2 | Create `apps/web/package.json` with name `@versus/web` | Package name correct | [x] |
| 4.3 | Add React 18.x dependency | React in dependencies | [x] |
| 4.4 | Add react-dom dependency | In dependencies | [x] |
| 4.5 | Add Vite as dev dependency | In devDependencies | [x] |
| 4.6 | Add @vitejs/plugin-react as dev dependency | In devDependencies | [x] |
| 4.7 | Add TypeScript and @types/react as dev dependencies | In devDependencies | [x] |
| 4.8 | Create `apps/web/src/` directory | Directory exists | [x] |
| 4.9 | Create placeholder `apps/web/src/main.tsx` | File exists | [x] |
| 4.10 | Create placeholder `apps/web/src/App.tsx` | File exists | [x] |
| 4.11 | Create `apps/web/index.html` | File exists with root div | [x] |
| 4.12 | Create `apps/web/vite.config.ts` | File exists | [x] |
| 4.13 | Add scripts: `dev`, `build`, `preview` | Scripts defined | [x] |

**File:** `apps/web/package.json`

**Verification:**
```bash
ls apps/web/src/main.tsx
ls apps/web/index.html
cat apps/web/package.json | grep react
```

**Acceptance Criteria:** AC-4

---

### Task 5: Configure TypeScript

**Goal:** Set up TypeScript with strict mode and path aliases

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 5.1 | Create root `tsconfig.json` with base settings | File exists | [x] |
| 5.2 | Enable `strict: true` | Strict mode enabled | [x] |
| 5.3 | Configure `compilerOptions.target` to ES2022 | Target set | [x] |
| 5.4 | Configure `compilerOptions.module` to ESNext | Module set | [x] |
| 5.5 | Configure `compilerOptions.moduleResolution` to bundler | Resolution set | [x] |
| 5.6 | Configure path aliases `@/*` pointing to `./src/*` | Paths configured | [x] |
| 5.7 | Set `noEmit: true` for type-checking only | No emit | [x] |
| 5.8 | Create `apps/api/tsconfig.json` extending root | File exists, extends root | [x] |
| 5.9 | Create `apps/web/tsconfig.json` extending root with JSX settings | File exists with jsx setting | [x] |

**Files:** `tsconfig.json`, `apps/api/tsconfig.json`, `apps/web/tsconfig.json`

**Verification:**
```bash
bun run typecheck  # Should pass (no errors)
cat tsconfig.json | grep '"strict": true'
```

**Acceptance Criteria:** AC-5

---

### Task 6: Configure Biome

**Goal:** Set up Biome for linting and formatting

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 6.1 | Add @biomejs/biome as root dev dependency | In root devDependencies | [x] |
| 6.2 | Create `biome.json` configuration file | File exists | [x] |
| 6.3 | Enable linter with recommended rules | Linter enabled | [x] |
| 6.4 | Enable formatter with 2-space indent | Formatter configured | [x] |
| 6.5 | Configure to ignore `node_modules`, `dist`, `coverage` | Ignore patterns set | [x] |
| 6.6 | Add `lint` script to root package.json | Script runs biome check | [x] |
| 6.7 | Add `lint:fix` script to root package.json | Script runs biome check --apply | [x] |
| 6.8 | Add `format` script to root package.json | Script runs biome format | [x] |

**File:** `biome.json`

**Verification:**
```bash
bun run lint  # Should pass with no errors
bun run format  # Should succeed
```

**Acceptance Criteria:** AC-6

---

### Task 7: Create README

**Goal:** Document project overview and setup instructions

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 7.1 | Create `README.md` with project title and description | File exists | [x] |
| 7.2 | Add project overview section | Overview present | [x] |
| 7.3 | Add tech stack section | Tech stack listed | [x] |
| 7.4 | Add prerequisites section (Bun 1.x, Node 18+) | Prerequisites listed | [x] |
| 7.5 | Add installation instructions | Install steps documented | [x] |
| 7.6 | Add development commands section | Commands documented | [x] |
| 7.7 | Add project structure overview | Structure documented | [x] |

**File:** `README.md`

**Verification:**
```bash
cat README.md | grep -E "# Versus|## Getting Started|bun install"
```

**Acceptance Criteria:** AC-7

---

### Task 8: Install Dependencies and Verify

**Goal:** Run bun install and verify workspace setup

**Subtasks:**

| ID | Subtask | Test | Status |
|----|---------|------|--------|
| 8.1 | Run `bun install` at root | Completes successfully | [x] |
| 8.2 | Verify `bun.lockb` created | Lockfile exists | [x] |
| 8.3 | Verify workspace symlinks in node_modules | @versus packages linked | [x] |
| 8.4 | Run `bun run lint` - should pass | No lint errors | [x] |
| 8.5 | Run `bun run typecheck` - should pass | No type errors | [x] |
| 8.6 | Commit all changes | Clean working tree | [x] |

**Verification:**
```bash
bun install
ls node_modules/@versus
bun run lint
bun run typecheck
git status  # Should show only lockfile if committed
```

---

## Implementation Order

```
1. Task 1 (Git init)        -> Foundation
2. Task 2 (Root package)    -> Workspace setup
3. Task 5 (TypeScript)      -> Type safety before code
4. Task 6 (Biome)           -> Linting before code
5. Task 3 (API workspace)   -> Backend structure
6. Task 4 (Web workspace)   -> Frontend structure
7. Task 7 (README)          -> Documentation
8. Task 8 (Verify)          -> Final validation
```

---

## Definition of Done

- [x] All acceptance criteria met
- [x] `bun install` succeeds
- [x] `bun run lint` passes
- [x] `bun run typecheck` passes
- [x] All files committed to git
- [x] README has clear setup instructions

---

## Files Created

```
versus/
├── .gitignore
├── package.json
├── tsconfig.json
├── biome.json
├── README.md
├── bun.lockb
├── apps/
│   ├── api/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   └── web/
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── main.tsx
│           └── App.tsx
└── node_modules/
```

---

## Notes

- This story establishes the foundation for all subsequent development
- No tests are written yet (that's Story 0.6)
- CI/CD is set up in Story 0.2
- Pre-commit hooks are set up in Story 0.3

---

*Refined: 2026-01-15*
