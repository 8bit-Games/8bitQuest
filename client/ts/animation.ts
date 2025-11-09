/**
 * Animation frame information
 */
export interface AnimationFrame {
  index: number;
  x: number;
  y: number;
}

/**
 * Animation class for managing sprite animations
 */
export class Animation {
  public name: string;
  public length: number;
  public row: number;
  public width: number;
  public height: number;
  public speed: number;
  public currentFrame: AnimationFrame;

  private lastTime: number;
  private count: number;
  private endcount_callback: (() => void) | null;

  /**
   * Create a new animation
   * @param name - Animation name (e.g., "idle_down", "atk_right")
   * @param length - Number of frames in the animation
   * @param row - Sprite sheet row index
   * @param width - Width of each frame in pixels
   * @param height - Height of each frame in pixels
   */
  constructor(name: string, length: number, row: number, width: number, height: number) {
    this.name = name;
    this.length = length;
    this.row = row;
    this.width = width;
    this.height = height;
    this.speed = 100; // Default speed in ms
    this.lastTime = 0;
    this.count = 0;
    this.endcount_callback = null;
    this.currentFrame = { index: 0, x: 0, y: 0 };
    this.reset();
  }

  /**
   * Advance to the next frame in the animation
   */
  tick(): void {
    let i = this.currentFrame.index;

    // Loop back to start after last frame
    i = i < this.length - 1 ? i + 1 : 0;

    // Handle count-based animations (play N times)
    if (this.count > 0) {
      if (i === 0) {
        this.count -= 1;
        if (this.count === 0) {
          this.currentFrame.index = 0;
          if (this.endcount_callback) {
            this.endcount_callback();
          }
          return;
        }
      }
    }

    // Update frame position in sprite sheet
    this.currentFrame.x = this.width * i;
    this.currentFrame.y = this.height * this.row;
    this.currentFrame.index = i;
  }

  /**
   * Set the animation speed
   * @param speed - Speed in milliseconds between frames
   */
  setSpeed(speed: number): void {
    this.speed = speed;
  }

  /**
   * Set the animation to play a specific number of times
   * @param count - Number of times to play the animation
   * @param onEndCount - Callback to execute when count reaches zero
   */
  setCount(count: number, onEndCount: () => void): void {
    this.count = count;
    this.endcount_callback = onEndCount;
  }

  /**
   * Check if enough time has passed to show the next frame
   * @param time - Current time in milliseconds
   * @returns true if it's time to animate
   */
  isTimeToAnimate(time: number): boolean {
    return time - this.lastTime > this.speed;
  }

  /**
   * Update the animation based on current time
   * @param time - Current time in milliseconds
   * @returns true if the animation advanced to a new frame
   */
  update(time: number): boolean {
    // Special case for attack animations
    if (this.lastTime === 0 && this.name.startsWith('atk')) {
      this.lastTime = time;
    }

    if (this.isTimeToAnimate(time)) {
      this.lastTime = time;
      this.tick();
      return true;
    }

    return false;
  }

  /**
   * Reset the animation to its initial state
   */
  reset(): void {
    this.lastTime = 0;
    this.currentFrame = {
      index: 0,
      x: 0,
      y: this.row * this.height,
    };
  }

  /**
   * Get the current frame data
   */
  getCurrentFrame(): AnimationFrame {
    return this.currentFrame;
  }

  /**
   * Check if animation is currently playing
   */
  isPlaying(): boolean {
    return this.currentFrame.index > 0 || this.count > 0;
  }
}

export default Animation;
