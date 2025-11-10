/**
 * Base Entity class for all game objects
 */
import { Animation } from './animation';
import { Sprite, SpriteVariant } from './sprite';
import { EntityKind, Orientation, isMob, isPlayer, getKindAsString } from '@shared/gametypes';

/**
 * Base Entity class
 * All game objects (players, mobs, items, NPCs) extend from this
 */
export class Entity {
  // Identity
  public id: number;
  public kind: EntityKind;
  public name?: string;

  // Rendering
  public sprite: Sprite | SpriteVariant | null;
  public normalSprite: Sprite | null;
  public hurtSprite: SpriteVariant | null;
  public flipSpriteX: boolean;
  public flipSpriteY: boolean;
  public animations: Record<string, Animation> | null;
  public currentAnimation: Animation | null;
  public shadowOffsetY: number;

  // Position (pixels)
  public x: number;
  public y: number;

  // Position (grid)
  public gridX: number;
  public gridY: number;

  // State
  public isLoaded: boolean;
  public isHighlighted: boolean;
  public visible: boolean;
  public isFading: boolean;
  public isDirty: boolean;
  public startFadingTime?: number;

  // Callbacks
  protected ready_func: (() => void) | null;
  protected dirty_callback: ((entity: Entity) => void) | null;

  // Blinking
  private blinking?: number;

  /**
   * Create a new entity
   * @param id - Unique entity ID
   * @param kind - Entity kind/type
   */
  constructor(id: number, kind: EntityKind) {
    this.id = id;
    this.kind = kind;

    // Renderer
    this.sprite = null;
    this.normalSprite = null;
    this.hurtSprite = null;
    this.flipSpriteX = false;
    this.flipSpriteY = false;
    this.animations = null;
    this.currentAnimation = null;
    this.shadowOffsetY = 0;

    // Position
    this.x = 0;
    this.y = 0;
    this.gridX = 0;
    this.gridY = 0;
    this.setGridPosition(0, 0);

    // State
    this.isLoaded = false;
    this.isHighlighted = false;
    this.visible = true;
    this.isFading = false;
    this.isDirty = false;

    // Callbacks
    this.ready_func = null;
    this.dirty_callback = null;

    this.setDirty();
  }

  /**
   * Set the entity name
   */
  setName(name: string): void {
    this.name = name;
  }

  /**
   * Set pixel position
   */
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Set grid position (tile-based)
   * @param x - Grid X coordinate
   * @param y - Grid Y coordinate
   */
  setGridPosition(x: number, y: number): void {
    this.gridX = x;
    this.gridY = y;
    this.setPosition(x * 16, y * 16);
  }

  /**
   * Set the sprite for this entity
   * @param sprite - Sprite to use
   */
  setSprite(sprite: Sprite): void {
    if (!sprite) {
      console.error(`${this.id}: sprite is null`);
      throw new Error('Sprite is null');
    }

    if (this.sprite && (this.sprite as Sprite).name === sprite.name) {
      return;
    }

    this.sprite = sprite;
    this.normalSprite = sprite;

    if (isMob(this.kind) || isPlayer(this.kind)) {
      this.hurtSprite = sprite.getHurtSprite();
    }

    this.animations = sprite.createAnimations();
    this.isLoaded = true;

    if (this.ready_func) {
      this.ready_func();
    }
  }

  /**
   * Get the current sprite
   */
  getSprite(): Sprite | SpriteVariant | null {
    return this.sprite;
  }

  /**
   * Get the sprite name for this entity
   */
  getSpriteName(): string {
    return getKindAsString(this.kind) || '';
  }

  /**
   * Get an animation by name
   * @param name - Animation name
   * @returns Animation or null if not found
   */
  getAnimationByName(name: string): Animation | null {
    if (!this.animations) {
      return null;
    }

    if (name in this.animations) {
      return this.animations[name];
    }

    console.error(`No animation called ${name}`);
    return null;
  }

  /**
   * Set the current animation
   * @param name - Animation name
   * @param speed - Animation speed in ms
   * @param count - Number of times to play (0 = infinite)
   * @param onEndCount - Callback when count reaches zero
   */
  setAnimation(name: string, speed: number, count?: number, onEndCount?: () => void): void {
    if (!this.isLoaded) {
      console.warn(`[${this.id}] Not ready for animation`);
      return;
    }

    if (this.currentAnimation && this.currentAnimation.name === name) {
      return;
    }

    const animation = this.getAnimationByName(name);
    if (!animation) {
      return;
    }

    this.currentAnimation = animation;

    // Reset attack animations
    if (name.startsWith('atk')) {
      this.currentAnimation.reset();
    }

    this.currentAnimation.setSpeed(speed);
    this.currentAnimation.setCount(
      count || 0,
      onEndCount ||
        (() => {
          this.idle();
        })
    );
  }

  /**
   * Return to idle animation (to be overridden by subclasses)
   */
  idle(): void {
    // Override in subclasses
  }

  /**
   * Check if entity should have a shadow
   */
  hasShadow(): boolean {
    return false;
  }

  /**
   * Set callback for when entity is ready
   * @param callback - Function to call when ready
   */
  ready(callback: () => void): void {
    this.ready_func = callback;
  }

  /**
   * Clean up entity resources
   */
  clean(): void {
    this.stopBlinking();
  }

  /**
   * Log info message
   */
  protected log_info(message: string): void {
    console.info(`[${this.id}] ${message}`);
  }

  /**
   * Log error message
   */
  protected log_error(message: string): void {
    console.error(`[${this.id}] ${message}`);
  }

  /**
   * Set highlight state (shows silhouette)
   * @param value - Whether to highlight
   */
  setHighlight(value: boolean): void {
    if (!this.normalSprite) {
      return;
    }

    if (value) {
      const silhouette = this.normalSprite.getSilhouette();
      if (silhouette) {
        this.sprite = silhouette;
        this.isHighlighted = true;
      }
    } else {
      this.sprite = this.normalSprite;
      this.isHighlighted = false;
    }
  }

  /**
   * Set visibility
   */
  setVisible(value: boolean): void {
    this.visible = value;
  }

  /**
   * Check if entity is visible
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Toggle visibility on/off
   */
  toggleVisibility(): void {
    this.setVisible(!this.visible);
  }

  /**
   * Get distance to another entity (Chebyshev distance)
   * @param entity - Other entity
   * @returns Distance (max of X and Y distance)
   */
  getDistanceToEntity(entity: Entity): number {
    const distX = Math.abs(entity.gridX - this.gridX);
    const distY = Math.abs(entity.gridY - this.gridY);
    return Math.max(distX, distY);
  }

  /**
   * Check if entity is close to another
   * @param entity - Other entity
   */
  isCloseTo(entity: Entity | null): boolean {
    if (!entity) {
      return false;
    }

    const dx = Math.abs(entity.gridX - this.gridX);
    const dy = Math.abs(entity.gridY - this.gridY);

    return dx < 30 && dy < 14;
  }

  /**
   * Check if entity is adjacent (within 1 tile)
   * @param entity - Other entity
   */
  isAdjacent(entity: Entity | null): boolean {
    if (!entity) {
      return false;
    }
    return this.getDistanceToEntity(entity) <= 1;
  }

  /**
   * Check if adjacent but not diagonally
   * @param entity - Other entity
   */
  isAdjacentNonDiagonal(entity: Entity | null): boolean {
    if (!entity || !this.isAdjacent(entity)) {
      return false;
    }

    // Not diagonal if either X or Y is the same
    return this.gridX === entity.gridX || this.gridY === entity.gridY;
  }

  /**
   * Check if diagonally adjacent
   * @param entity - Other entity
   */
  isDiagonallyAdjacent(entity: Entity | null): boolean {
    if (!entity) {
      return false;
    }
    return this.isAdjacent(entity) && !this.isAdjacentNonDiagonal(entity);
  }

  /**
   * Iterate over all non-diagonal adjacent positions
   * @param callback - Function to call for each position
   */
  forEachAdjacentNonDiagonalPosition(
    callback: (x: number, y: number, orientation: Orientation) => void
  ): void {
    callback(this.gridX - 1, this.gridY, Orientation.LEFT);
    callback(this.gridX, this.gridY - 1, Orientation.UP);
    callback(this.gridX + 1, this.gridY, Orientation.RIGHT);
    callback(this.gridX, this.gridY + 1, Orientation.DOWN);
  }

  /**
   * Start fade-in animation
   * @param currentTime - Current game time
   */
  fadeIn(currentTime: number): void {
    this.isFading = true;
    this.startFadingTime = currentTime;
  }

  /**
   * Start blinking effect
   * @param speed - Blink speed in ms
   * @param callback - Optional callback
   */
  blink(speed: number, callback?: () => void): void {
    this.blinking = window.setInterval(() => {
      this.toggleVisibility();
    }, speed);
  }

  /**
   * Stop blinking effect
   */
  stopBlinking(): void {
    if (this.blinking) {
      clearInterval(this.blinking);
      this.blinking = undefined;
    }
    this.setVisible(true);
  }

  /**
   * Mark entity as dirty (needs redraw)
   */
  setDirty(): void {
    this.isDirty = true;
    if (this.dirty_callback) {
      this.dirty_callback(this);
    }
  }

  /**
   * Set callback for when entity becomes dirty
   * @param callback - Dirty callback
   */
  onDirty(callback: (entity: Entity) => void): void {
    this.dirty_callback = callback;
  }
}

export default Entity;
