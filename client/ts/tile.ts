/**
 * Tile classes for map rendering
 */

/**
 * Base Tile class
 * Currently serves as a placeholder for future tile functionality
 */
export class Tile {
  // Base tile class - may be extended in the future
}

/**
 * Animated tile for dynamic map elements
 * Used for water, lava, animated decorations, etc.
 */
export class AnimatedTile extends Tile {
  public id: number;
  public readonly startId: number;
  public readonly length: number;
  public readonly speed: number;
  public readonly index: number;

  private lastTime: number;

  /**
   * Create an animated tile
   * @param id - Starting tile ID in the tileset
   * @param length - Number of frames in the animation
   * @param speed - Animation speed in milliseconds between frames
   * @param index - Tile index in the map
   */
  constructor(id: number, length: number, speed: number, index: number) {
    super();
    this.startId = id;
    this.id = id;
    this.length = length;
    this.speed = speed;
    this.index = index;
    this.lastTime = 0;
  }

  /**
   * Advance to the next frame in the animation
   */
  tick(): void {
    if (this.id - this.startId < this.length - 1) {
      this.id += 1;
    } else {
      // Loop back to start
      this.id = this.startId;
    }
  }

  /**
   * Update the animation based on current time
   * @param time - Current time in milliseconds
   * @returns true if the tile advanced to a new frame
   */
  animate(time: number): boolean {
    if (time - this.lastTime > this.speed) {
      this.tick();
      this.lastTime = time;
      return true;
    }
    return false;
  }

  /**
   * Reset the animation to its starting frame
   */
  reset(): void {
    this.id = this.startId;
    this.lastTime = 0;
  }

  /**
   * Get the current frame number (0-based)
   */
  getCurrentFrame(): number {
    return this.id - this.startId;
  }

  /**
   * Check if animation is at the first frame
   */
  isAtStart(): boolean {
    return this.id === this.startId;
  }

  /**
   * Set animation to a specific frame
   * @param frame - Frame number (0-based)
   */
  setFrame(frame: number): void {
    const clampedFrame = Math.max(0, Math.min(frame, this.length - 1));
    this.id = this.startId + clampedFrame;
  }
}

// Default export for backward compatibility
export default AnimatedTile;
