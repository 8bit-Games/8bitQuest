/**
 * Game updater - handles all per-frame update logic
 */
import { Character } from './character';
import { Timer } from './timer';
import { Orientation } from '@shared/gametypes';
import { Entity } from './entity';
import { Camera } from './camera';
import { Transition } from './transition';

/**
 * Minimal interface for game object
 */
export interface UpdaterGame {
  currentTime: number;
  currentZoning: Transition | null;
  zoningOrientation: Orientation;
  player: Character | null;
  camera: Camera;
  renderer: any; // Complex renderer interface
  bubbleManager: any;
  infoManager: any;
  sparksAnimation: any;
  targetAnimation: any;
  forEachEntity(callback: (entity: Entity) => void): void;
  forEachAnimatedTile(callback: (tile: any) => void): void;
  onCharacterUpdate(character: Character): void;
  initAnimatedTiles(): void;
  endZoning(): void;
  checkOtherDirtyRects(rect: any, tile: any, x: number, y: number): void;
}

/**
 * Updater class - manages all per-frame game updates
 * Handles character movement, animations, transitions, and effects
 */
export class Updater {
  public game: UpdaterGame;
  private playerAggroTimer: Timer;

  /**
   * Create a new updater
   * @param game - Game instance
   */
  constructor(game: UpdaterGame) {
    this.game = game;
    this.playerAggroTimer = new Timer(1000);
  }

  /**
   * Main update method - called every frame
   */
  update(): void {
    this.updateZoning();
    this.updateCharacters();
    this.updatePlayerAggro();
    this.updateTransitions();
    this.updateAnimations();
    this.updateAnimatedTiles();
    this.updateChatBubbles();
    this.updateInfos();
  }

  /**
   * Update all character entities
   */
  updateCharacters(): void {
    this.game.forEachEntity((entity) => {
      const isCharacter = entity instanceof Character;

      if (entity.isLoaded) {
        if (isCharacter) {
          this.updateCharacter(entity as Character);
          this.game.onCharacterUpdate(entity as Character);
        }
        this.updateEntityFading(entity);
      }
    });
  }

  /**
   * Update player aggro checking
   */
  updatePlayerAggro(): void {
    const t = this.game.currentTime;
    const player = this.game.player;

    // Check player aggro every 1s when not moving nor attacking
    if (player && !player.isMoving() && !player.isAttacking() && this.playerAggroTimer.isOver(t)) {
      player.checkAggro();
    }
  }

  /**
   * Update entity fade-in effect
   * @param entity - Entity to update
   */
  updateEntityFading(entity: Entity): void {
    if (entity && entity.isFading) {
      const duration = 1000;
      const t = this.game.currentTime;
      const dt = t - entity.startFadingTime;

      if (dt > duration) {
        entity.isFading = false;
        entity.fadingAlpha = 1;
      } else {
        entity.fadingAlpha = dt / duration;
      }
    }
  }

  /**
   * Update all movement transitions
   */
  updateTransitions(): void {
    const z = this.game.currentZoning;

    this.game.forEachEntity((entity) => {
      const m = entity.movement;
      if (m) {
        if (m.inProgress) {
          m.step(this.game.currentTime);
        }
      }
    });

    if (z) {
      if (z.inProgress) {
        z.step(this.game.currentTime);
      }
    }
  }

  /**
   * Update camera zoning (screen transitions)
   */
  updateZoning(): void {
    const g = this.game;
    const c = g.camera;
    const z = g.currentZoning;
    const ts = 16;
    const speed = 500;

    if (z && z.inProgress === false) {
      const orientation = this.game.zoningOrientation;
      let startValue = 0;
      let endValue = 0;
      let offset = 0;
      let updateFunc: ((value: number) => void) | null = null;
      let endFunc: (() => void) | null = null;

      if (orientation === Orientation.LEFT || orientation === Orientation.RIGHT) {
        offset = (c.gridW - 2) * ts;
        startValue = orientation === Orientation.LEFT ? c.x - ts : c.x + ts;
        endValue = orientation === Orientation.LEFT ? c.x - offset : c.x + offset;
        updateFunc = (x: number) => {
          c.setPosition(x, c.y);
          g.initAnimatedTiles();
          g.renderer.renderStaticCanvases();
        };
        endFunc = () => {
          c.setPosition(z.endValue, c.y);
          g.endZoning();
        };
      } else if (orientation === Orientation.UP || orientation === Orientation.DOWN) {
        offset = (c.gridH - 2) * ts;
        startValue = orientation === Orientation.UP ? c.y - ts : c.y + ts;
        endValue = orientation === Orientation.UP ? c.y - offset : c.y + offset;
        updateFunc = (y: number) => {
          c.setPosition(c.x, y);
          g.initAnimatedTiles();
          g.renderer.renderStaticCanvases();
        };
        endFunc = () => {
          c.setPosition(c.x, z.endValue);
          g.endZoning();
        };
      }

      z.start(this.game.currentTime, updateFunc, endFunc, startValue, endValue, speed);
    }
  }

  /**
   * Update a character's movement
   * @param c - Character to update
   */
  updateCharacter(c: Character): void {
    // Estimate of the movement distance for one update
    const tick = Math.round(16 / Math.round(c.moveSpeed / (1000 / this.game.renderer.FPS)));

    if (c.isMoving() && c.movement.inProgress === false) {
      if (c.orientation === Orientation.LEFT) {
        c.movement.start(
          this.game.currentTime,
          (x: number) => {
            c.x = x;
            c.hasMoved();
          },
          () => {
            c.x = c.movement.endValue;
            c.hasMoved();
            c.nextStep();
          },
          c.x - tick,
          c.x - 16,
          c.moveSpeed
        );
      } else if (c.orientation === Orientation.RIGHT) {
        c.movement.start(
          this.game.currentTime,
          (x: number) => {
            c.x = x;
            c.hasMoved();
          },
          () => {
            c.x = c.movement.endValue;
            c.hasMoved();
            c.nextStep();
          },
          c.x + tick,
          c.x + 16,
          c.moveSpeed
        );
      } else if (c.orientation === Orientation.UP) {
        c.movement.start(
          this.game.currentTime,
          (y: number) => {
            c.y = y;
            c.hasMoved();
          },
          () => {
            c.y = c.movement.endValue;
            c.hasMoved();
            c.nextStep();
          },
          c.y - tick,
          c.y - 16,
          c.moveSpeed
        );
      } else if (c.orientation === Orientation.DOWN) {
        c.movement.start(
          this.game.currentTime,
          (y: number) => {
            c.y = y;
            c.hasMoved();
          },
          () => {
            c.y = c.movement.endValue;
            c.hasMoved();
            c.nextStep();
          },
          c.y + tick,
          c.y + 16,
          c.moveSpeed
        );
      }
    }
  }

  /**
   * Update all entity animations
   */
  updateAnimations(): void {
    const t = this.game.currentTime;

    this.game.forEachEntity((entity) => {
      const anim = entity.currentAnimation;

      if (anim) {
        if (anim.update(t)) {
          entity.setDirty();
        }
      }
    });

    const sparks = this.game.sparksAnimation;
    if (sparks) {
      sparks.update(t);
    }

    const target = this.game.targetAnimation;
    if (target) {
      target.update(t);
    }
  }

  /**
   * Update animated map tiles
   */
  updateAnimatedTiles(): void {
    const t = this.game.currentTime;

    this.game.forEachAnimatedTile((tile) => {
      if (tile.animate(t)) {
        tile.isDirty = true;
        tile.dirtyRect = this.game.renderer.getTileBoundingRect(tile);

        if (this.game.renderer.mobile || this.game.renderer.tablet) {
          this.game.checkOtherDirtyRects(tile.dirtyRect, tile, tile.x, tile.y);
        }
      }
    });
  }

  /**
   * Update chat bubbles
   */
  updateChatBubbles(): void {
    const t = this.game.currentTime;
    this.game.bubbleManager.update(t);
  }

  /**
   * Update info popups
   */
  updateInfos(): void {
    const t = this.game.currentTime;
    this.game.infoManager.update(t);
  }
}

export default Updater;
