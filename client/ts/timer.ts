/**
 * Timer utility class for tracking time-based events
 */
export class Timer {
  private lastTime: number;
  private duration: number;

  /**
   * Create a new timer
   * @param duration - How long the timer should run (in milliseconds)
   * @param startTime - Optional starting time (defaults to 0)
   */
  constructor(duration: number, startTime: number = 0) {
    this.lastTime = startTime;
    this.duration = duration;
  }

  /**
   * Check if the timer duration has elapsed since the last check
   * @param time - Current time to check against
   * @returns true if the duration has passed, false otherwise
   */
  isOver(time: number): boolean {
    if (time - this.lastTime > this.duration) {
      this.lastTime = time;
      return true;
    }
    return false;
  }

  /**
   * Reset the timer to a new start time
   * @param time - Time to reset to
   */
  reset(time: number = 0): void {
    this.lastTime = time;
  }

  /**
   * Get the remaining time until the timer expires
   * @param currentTime - Current time
   * @returns Remaining time in milliseconds, or 0 if already expired
   */
  getRemaining(currentTime: number): number {
    const remaining = this.duration - (currentTime - this.lastTime);
    return Math.max(0, remaining);
  }

  /**
   * Check if timer is currently running (not expired)
   * @param currentTime - Current time
   * @returns true if timer is still running
   */
  isRunning(currentTime: number): boolean {
    return currentTime - this.lastTime <= this.duration;
  }
}

export default Timer;
