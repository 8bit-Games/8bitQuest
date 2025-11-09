/**
 * Transition class for smooth value interpolation over time
 * Used for animations like camera panning, fades, etc.
 */
export class Transition {
  private startTime: number;
  private startValue: number;
  private endValue: number;
  private duration: number;
  private inProgress: boolean;
  private count: number;
  private updateFunction: ((value: number) => void) | null;
  private stopFunction: (() => void) | null;

  /**
   * Create a new transition
   */
  constructor() {
    this.startTime = 0;
    this.startValue = 0;
    this.endValue = 0;
    this.duration = 0;
    this.inProgress = false;
    this.count = 0;
    this.updateFunction = null;
    this.stopFunction = null;
  }

  /**
   * Start a new transition
   * @param currentTime - Current time in milliseconds
   * @param updateFunction - Function to call with interpolated values
   * @param stopFunction - Function to call when transition completes
   * @param startValue - Starting value
   * @param endValue - Ending value
   * @param duration - Transition duration in milliseconds
   */
  start(
    currentTime: number,
    updateFunction: (value: number) => void,
    stopFunction: (() => void) | null,
    startValue: number,
    endValue: number,
    duration: number
  ): void {
    this.startTime = currentTime;
    this.updateFunction = updateFunction;
    this.stopFunction = stopFunction;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.inProgress = true;
    this.count = 0;
  }

  /**
   * Update the transition for the current frame
   * @param currentTime - Current time in milliseconds
   */
  step(currentTime: number): void {
    if (!this.inProgress) {
      return;
    }

    if (this.count > 0) {
      this.count -= 1;
      console.debug(`${currentTime}: jumped frame`);
      return;
    }

    let elapsed = currentTime - this.startTime;

    // Clamp elapsed time to duration
    if (elapsed > this.duration) {
      elapsed = this.duration;
    }

    // Linear interpolation
    const diff = this.endValue - this.startValue;
    let interpolatedValue = this.startValue + (diff / this.duration) * elapsed;
    interpolatedValue = Math.round(interpolatedValue);

    // Check if transition is complete
    if (elapsed === this.duration || interpolatedValue === this.endValue) {
      this.stop();
      if (this.stopFunction) {
        this.stopFunction();
      }
    } else if (this.updateFunction) {
      this.updateFunction(interpolatedValue);
    }
  }

  /**
   * Restart the transition with new values
   * @param currentTime - Current time in milliseconds
   * @param startValue - New starting value
   * @param endValue - New ending value
   */
  restart(currentTime: number, startValue: number, endValue: number): void {
    if (!this.updateFunction) {
      console.warn('Cannot restart transition: no update function set');
      return;
    }

    this.start(
      currentTime,
      this.updateFunction,
      this.stopFunction,
      startValue,
      endValue,
      this.duration
    );
    this.step(currentTime);
  }

  /**
   * Stop the transition immediately
   */
  stop(): void {
    this.inProgress = false;
  }

  /**
   * Check if transition is currently running
   */
  isInProgress(): boolean {
    return this.inProgress;
  }

  /**
   * Get the current progress (0.0 to 1.0)
   * @param currentTime - Current time
   * @returns Progress value between 0 and 1
   */
  getProgress(currentTime: number): number {
    if (!this.inProgress || this.duration === 0) {
      return 1.0;
    }

    const elapsed = currentTime - this.startTime;
    return Math.min(1.0, elapsed / this.duration);
  }
}

export default Transition;
