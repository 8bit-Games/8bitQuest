# Migration Guide: JavaScript to TypeScript

This guide shows how to incrementally migrate the codebase from JavaScript to TypeScript.

## Strategy

We're using an **incremental migration** approach:

1. Keep existing JS files working
2. Convert modules one at a time
3. Start with shared code, then client, then server
4. Use `// @ts-ignore` temporarily for complex cases
5. Add types gradually, starting with `any`

## Step-by-Step Example: Migrating a Module

### Before (JavaScript - client/js/timer.js)

```javascript
define(function () {
  var Timer = Class.extend({
    init: function (duration, startTime) {
      this.duration = duration;
      this.start = startTime || Date.now();
    },

    isOver: function (time) {
      var elapsed = time - this.start;
      return elapsed > this.duration;
    },
  });

  return Timer;
});
```

### After (TypeScript - client/js/timer.ts)

```typescript
export class Timer {
  private duration: number;
  private start: number;

  constructor(duration: number, startTime?: number) {
    this.duration = duration;
    this.start = startTime || Date.now();
  }

  isOver(time: number): boolean {
    const elapsed = time - this.start;
    return elapsed > this.duration;
  }
}
```

### Changes Made

1. ✅ Removed RequireJS `define()` wrapper
2. ✅ Changed to ES6 `export` syntax
3. ✅ Removed `Class.extend()` pattern
4. ✅ Used native ES6 `class` syntax
5. ✅ Added TypeScript types
6. ✅ Used `private` access modifier
7. ✅ Changed `var` to `const`/`let`
8. ✅ Added return type annotations

## Migration Order

### Phase 1: Shared Code (Start Here)

1. `shared/js/gametypes.js` → `gametypes.ts`
2. Define interfaces for entities, messages, etc.

### Phase 2: Utility Classes

1. `client/js/timer.js` → `timer.ts`
2. `client/js/text.js` → `text.ts`
3. `client/js/animation.js` → `animation.ts`

### Phase 3: Core Game Classes

1. `client/js/entity.js` → `entity.ts`
2. `client/js/character.js` → `character.ts`
3. `client/js/player.js` → `player.ts`
4. `client/js/mob.js` → `mob.ts`

### Phase 4: Game Systems

1. `client/js/sprite.js` → `sprite.ts`
2. `client/js/renderer.js` → `renderer.ts`
3. `client/js/map.js` → `map.ts`
4. `client/js/game.js` → `game.ts`

### Phase 5: Server Code

1. `server/js/entity.js` → `entity.ts`
2. `server/js/player.js` → `player.ts`
3. `server/js/worldserver.js` → `worldserver.ts`
4. `server/js/main.js` → `main.ts`

## Common Patterns

### 1. RequireJS → ES Modules

**Before:**

```javascript
define(['underscore', './entity'], function (_, Entity) {
  // code
});
```

**After:**

```typescript
import _ from 'underscore'; // or remove if using native
import { Entity } from './entity';
```

### 2. Class.extend() → Native Classes

**Before:**

```javascript
var Player = Character.extend({
  init: function (name) {
    this._super(name);
  },
});
```

**After:**

```typescript
export class Player extends Character {
  constructor(name: string) {
    super(name);
  }
}
```

### 3. Callback Types

**Before:**

```javascript
onDeath: function(callback) {
    this.death_callback = callback;
}
```

**After:**

```typescript
onDeath(callback: () => void): void {
    this.death_callback = callback;
}
```

### 4. jQuery → Native DOM

**Before:**

```javascript
$('#container').addClass('error');
```

**After:**

```typescript
document.getElementById('container')?.classList.add('error');
```

### 5. Underscore → Native JavaScript

**Before:**

```javascript
_.each(this.entities, function (entity) {
  // ...
});
```

**After:**

```typescript
Object.values(this.entities).forEach((entity) => {
  // ...
});
```

## Type Definitions

Create type definition files for shared types:

### types/game.d.ts

```typescript
export interface Position {
  x: number;
  y: number;
}

export interface EntityData {
  id: number;
  kind: number;
  x: number;
  y: number;
}

export enum Orientation {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
}

export type MessageHandler = (data: any) => void;
```

## Gradual Typing

Start with loose types, then tighten:

**Step 1: Any types**

```typescript
class Game {
  entities: any = {};

  addEntity(entity: any) {
    this.entities[entity.id] = entity;
  }
}
```

**Step 2: Basic types**

```typescript
class Game {
  entities: Record<number, Entity> = {};

  addEntity(entity: Entity) {
    this.entities[entity.id] = entity;
  }
}
```

**Step 3: Strict types**

```typescript
class Game {
  private entities: Map<number, Entity> = new Map();

  addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  getEntity(id: number): Entity | undefined {
    return this.entities.get(id);
  }
}
```

## Testing During Migration

1. Keep both JS and TS files during transition
2. Test each converted module thoroughly
3. Use feature flags if needed
4. Run both versions in parallel initially

## Checklist for Each File

- [ ] Remove RequireJS wrapper
- [ ] Convert to ES6 class syntax
- [ ] Add TypeScript types
- [ ] Update imports/exports
- [ ] Replace jQuery with native DOM
- [ ] Replace Underscore with native JS
- [ ] Add JSDoc comments
- [ ] Test functionality
- [ ] Update dependent files
- [ ] Remove old JS file

## Tools

### Automated Migration Helpers

```bash
# Check types without emitting files
npm run type-check

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Useful VS Code Extensions

- TypeScript Hero (auto-import)
- ESLint
- Prettier
- Path Intellisense

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)

## Common Issues

### Issue: Cannot find module

```
error TS2307: Cannot find module './game'
```

**Solution:** Add `.ts` extension to imports temporarily or configure module resolution

### Issue: Class.extend is not defined

```
error TS2304: Cannot find name 'Class'
```

**Solution:** Convert to native ES6 class syntax

### Issue: $ is not defined

```
error TS2304: Cannot find name '$'
```

**Solution:** Replace jQuery with native DOM or add jQuery types

## Next Steps

After migrating JavaScript to TypeScript:

1. Remove RequireJS completely
2. Setup proper module bundling
3. Add strict null checks
4. Implement proper error handling
5. Add comprehensive type coverage
