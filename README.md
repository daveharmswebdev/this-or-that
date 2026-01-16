# Versus

[![CI](https://github.com/daveharmswebdev/this-or-that/actions/workflows/ci.yml/badge.svg)](https://github.com/daveharmswebdev/this-or-that/actions/workflows/ci.yml)

A movie ranking game that uses Swiss tournament format to determine your order of preference through pairwise comparisons.

## Overview

Versus presents users with a series of "this or that" questions to efficiently rank movies by preference. Instead of asking users to manually sort a list, the app uses the Swiss tournament format to minimize the number of comparisons needed while producing accurate rankings.

**How it works:**
1. Select a movie genre
2. Answer a series of "Would you rather watch X or Y?" questions
3. Get your personalized ranking from most to least preferred

## Tech Stack

- **Runtime:** [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Backend:** [Hono](https://hono.dev/) - Lightweight web framework
- **Frontend:** [React](https://react.dev/) 18 + [Vite](https://vitejs.dev/)
- **Database:** SQLite with [Drizzle ORM](https://orm.drizzle.team/)
- **Language:** TypeScript (strict mode)
- **Linting/Formatting:** [Biome](https://biomejs.dev/)

## Prerequisites

- [Bun](https://bun.sh/) 1.x or later
- Node.js 18+ (for some tooling compatibility)

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd versus

# Install dependencies
bun install
```

### Development

```bash
# Start all services in development mode
bun run dev

# Or start services individually
bun run --filter @versus/api dev   # API on http://localhost:3001
bun run --filter @versus/web dev   # Web on http://localhost:5173
```

### Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install all dependencies |
| `bun run dev` | Start development servers |
| `bun run build` | Build all packages |
| `bun run lint` | Run Biome linter |
| `bun run lint:fix` | Fix linting issues |
| `bun run format` | Format code with Biome |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run test` | Run tests in watch mode |
| `bun run test:unit` | Run unit tests |
| `bun run test:integration` | Run integration tests |

## Project Structure

```
versus/
├── apps/
│   ├── api/          # Hono backend API
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/          # React frontend
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── biome.json        # Biome configuration
├── package.json      # Root workspace config
├── tsconfig.json     # Base TypeScript config
└── README.md
```

## Workspaces

This is a monorepo using Bun workspaces:

- `@versus/api` - Backend API server
- `@versus/web` - React frontend application

## License

MIT
