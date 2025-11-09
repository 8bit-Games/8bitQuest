# 8bitQuest - Quick Start Guide

## Prerequisites

```bash
node -v  # Must be >= 20.0.0
npm -v   # Must be >= 10.0.0
```

If you need to upgrade:

- Download from https://nodejs.org/
- Or use nvm: `nvm install 20`

## Installation

```bash
# Clone the repository
git clone https://github.com/8bit-Games/8bitQuest.git
cd 8bitQuest

# Checkout modernization branch
git checkout claude/repo-analysis-modernization-011CUx4GUjoERAxnPeoQDrmT

# Install dependencies
npm install
```

## Development

```bash
# Start development servers (client + server)
npm run dev
```

This starts:

- **Client** at http://localhost:3000 (with HMR)
- **Server** at http://localhost:8000 (WebSocket)

## What You'll See

1. **Vite Dev Server** starts on port 3000
2. **Game Server** starts on port 8000
3. Open http://localhost:3000 in your browser
4. The original BrowserQuest game loads (legacy JS)
5. Make changes and see instant updates!

## Development Workflow

### 1. Create a New Feature

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make changes
code .

# Auto-format on save (if using VS Code)
# Or manually:
npm run format

# Check types
npm run type-check

# Lint code
npm run lint:fix
```

### 2. Convert a Module to TypeScript

```bash
# Example: Convert timer.js to timer.ts
# 1. Copy the file
cp client/js/timer.js client/js/timer.ts

# 2. Edit timer.ts
code client/js/timer.ts

# 3. Follow MIGRATION_GUIDE.md
# 4. Test the changes
npm run dev

# 5. Check types
npm run type-check
```

### 3. Build for Production

```bash
# Build everything
npm run build

# Output goes to:
# - dist/client/  (frontend)
# - dist/server/  (backend)

# Preview production build
npm run preview

# Start production server
npm start
```

## Common Tasks

### Add a New Dependency

```bash
# Runtime dependency
npm install <package>

# Development dependency
npm install --save-dev <package>

# Update package.json and run:
npm install
```

### Fix Linting Errors

```bash
# Auto-fix what can be fixed
npm run lint:fix

# Check manually
npm run lint
```

### Format Code

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With UI
npm run test:ui

# Coverage
npm run test:coverage
```

## Project Structure

```
8bitQuest/
├── client/           # Frontend code
│   ├── js/          # JavaScript (will migrate to TS)
│   ├── css/         # Stylesheets
│   ├── img/         # Images and sprites
│   └── index.html   # Entry point
├── server/          # Backend code
│   ├── js/          # Server logic (will migrate to TS)
│   └── maps/        # Game maps
├── shared/          # Code used by both
│   └── js/          # Game types (will migrate to TS)
├── dist/            # Build output (generated)
└── docs/            # Documentation
```

## Configuration Files

- `.env` - Environment variables (create from .env.example)
- `vite.config.ts` - Vite bundler config
- `tsconfig.json` - TypeScript config (client)
- `tsconfig.server.json` - TypeScript config (server)
- `.eslintrc.json` - Linting rules
- `.prettierrc.json` - Formatting rules

## Helpful VS Code Extensions

Install these for the best experience:

1. **ESLint** - Auto-fix on save
2. **Prettier** - Code formatting
3. **TypeScript** - Language support
4. **Path Intellisense** - Auto-complete imports

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port
npx kill-port 3000
npx kill-port 8000
```

### Module Not Found

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Clear cache
rm -rf node_modules/.cache
rm -rf dist
npm install
```

### Git Hooks Failing

```bash
# Skip hooks temporarily (not recommended)
git commit --no-verify -m "message"

# Or fix the issues:
npm run lint:fix
npm run format
```

## Environment Variables

Create `.env` file:

```env
NODE_ENV=development
PORT=8000
HOST=localhost
NB_WORLDS=5
NB_PLAYERS_PER_WORLD=200
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
```

## Next Steps

1. ✅ Read `README.MODERNIZATION.md` for full overview
2. ✅ Read `MIGRATION_GUIDE.md` for JS → TS conversion
3. ✅ Read `CHANGELOG.md` for version history
4. ✅ Start developing!

## Getting Help

- **Documentation:** See `docs/` directory
- **Migration Help:** See `MIGRATION_GUIDE.md`
- **Phase 1 Summary:** See `PHASE1_SUMMARY.md`
- **Issues:** Create issue on GitHub

## Quick Commands Reference

```bash
# Development
npm run dev              # Start everything
npm run dev:client       # Client only
npm run dev:server       # Server only

# Building
npm run build            # Build all
npm run preview          # Preview build
npm start                # Production server

# Quality
npm run lint             # Check code
npm run lint:fix         # Fix issues
npm run format           # Format code
npm run type-check       # Check types

# Testing
npm test                 # Run tests
npm run test:ui          # Test UI
npm run test:coverage    # Coverage
```

## Tips

- Use HMR: Changes appear instantly in browser
- Use TypeScript: Get type safety and autocomplete
- Use ESLint: Catch errors before runtime
- Use Prettier: Never worry about formatting
- Use Git hooks: Code is checked before commit

---

**Happy Coding! 🎮🚀**
