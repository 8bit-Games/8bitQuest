# 8bitQuest - Modernization Guide

## Overview

This is the modernized version of BrowserQuest, migrated to use current web technologies and best practices.

## What's New

### 🚀 Modern Tech Stack

- **TypeScript 5.x** - Full type safety
- **Vite** - Lightning-fast build tool with HMR
- **Node.js 20 LTS** - Latest stable runtime
- **ES Modules** - Native JavaScript modules (no RequireJS)
- **Modern WebSocket** - Using `ws` library
- **Express.js** - Modern HTTP server

### 🛠️ Developer Experience

- **ESLint + Prettier** - Automated code formatting and linting
- **Husky** - Git hooks for code quality
- **Hot Module Replacement** - Instant updates during development
- **Source Maps** - Easy debugging
- **VS Code Integration** - Optimal editor settings

### 📦 Build System

- **Vite** - Fast bundling and dev server
- **TypeScript** - Compile-time type checking
- **Code Splitting** - Optimized chunk loading
- **Asset Optimization** - Compressed sprites and audio

### 🔒 Modern Security

- **Helmet.js** - Security headers
- **CORS** - Proper cross-origin configuration
- **Input Validation** - Sanitized user input
- **Environment Variables** - Secure configuration

## Getting Started

### Prerequisites

```bash
node >= 20.0.0
npm >= 10.0.0
```

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Development

```bash
# Run both client and server in development mode
npm run dev

# Run client only
npm run dev:client

# Run server only
npm run dev:server
```

The client will be available at `http://localhost:3000`
The server will run on `http://localhost:8000`

### Production Build

```bash
# Build both client and server
npm run build

# Preview production build
npm run preview

# Start production server
npm start
```

## Project Structure

```
8bitQuest/
├── client/              # Frontend code
│   ├── js/             # Game logic (will be migrated to TypeScript)
│   ├── css/            # Styles
│   ├── img/            # Images and sprites
│   ├── audio/          # Sound effects and music
│   └── index.html      # Entry point
├── server/             # Backend code
│   ├── js/             # Server logic (will be migrated to TypeScript)
│   └── maps/           # Game world data
├── shared/             # Shared code between client and server
├── dist/               # Build output (generated)
│   ├── client/         # Built client files
│   └── server/         # Built server files
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config (client)
├── tsconfig.server.json # TypeScript config (server)
└── package.json        # Dependencies and scripts
```

## Available Scripts

### Development

- `npm run dev` - Start development servers (client + server)
- `npm run dev:client` - Start Vite dev server
- `npm run dev:server` - Start Node.js server with watch mode

### Building

- `npm run build` - Build for production
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm run preview` - Preview production build

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Check TypeScript types

### Testing

- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=8000
HOST=localhost
NB_WORLDS=5
NB_PLAYERS_PER_WORLD=200
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
```

### Server Configuration

Edit `server/config.json` for game-specific settings:

- Number of worlds
- Players per world
- Map file path
- Metrics settings

## Migration Status

### ✅ Completed

- [x] Modern package.json with proper dependencies
- [x] TypeScript configuration
- [x] Vite build system
- [x] ESLint and Prettier setup
- [x] Environment configuration
- [x] Git hooks with Husky
- [x] VS Code integration

### 🚧 In Progress

- [ ] Convert JavaScript to TypeScript (incremental)
- [ ] Migrate from RequireJS to ES modules
- [ ] Update WebSocket implementation
- [ ] Add tests

### 📋 Planned

- [ ] Database integration
- [ ] User authentication
- [ ] PWA features
- [ ] Improved mobile support
- [ ] Admin panel

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Format with Prettier before committing
- Write meaningful commit messages

### Git Workflow

1. Create feature branch from `main`
2. Make changes
3. Run `npm run lint` and `npm run type-check`
4. Commit (Husky will run pre-commit hooks)
5. Push and create Pull Request

### Testing

- Write unit tests for new features
- Run tests before committing
- Maintain coverage above 80%

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8000
npx kill-port 8000

# Or change port in .env
PORT=8001
```

### Type Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
rm -rf dist

# Reinstall dependencies
npm ci
```

### Build Errors

```bash
# Clear all caches and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Follow the development guidelines
4. Submit a pull request

## License

MPL 2.0 - See LICENSE file for details

## Credits

- **Original BrowserQuest** - Little Workshop for Mozilla
- **Modernization** - Community Contributors

## Resources

- [Original BrowserQuest](https://github.com/mozilla/BrowserQuest)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
