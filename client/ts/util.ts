/**
 * Utility functions for the game
 */

/**
 * Check if a number is an integer
 * @param n - Number to check
 * @returns true if the number is an integer
 */
export function isInt(n: number): boolean {
  return n % 1 === 0;
}

/**
 * CSS transition end event names
 * Modern browsers use 'transitionend', but we include vendor prefixes for legacy support
 */
export const TRANSITIONEND = 'transitionend webkitTransitionEnd oTransitionEnd';

/**
 * Request animation frame with fallback
 * Modern browsers have native support, but this provides a consistent interface
 */
export const requestAnimFrame: (callback: FrameRequestCallback) => number =
  window.requestAnimationFrame ||
  (window as any).webkitRequestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  (window as any).oRequestAnimationFrame ||
  (window as any).msRequestAnimationFrame ||
  function (callback: FrameRequestCallback): number {
    return window.setTimeout(() => callback(Date.now()), 1000 / 60);
  };

/**
 * Legacy exports for backward compatibility
 */
declare global {
  interface Window {
    requestAnimFrame?: (callback: FrameRequestCallback) => number;
  }
}

// Export to window for legacy code compatibility
if (typeof window !== 'undefined') {
  window.requestAnimFrame = requestAnimFrame;
}

export default {
  isInt,
  TRANSITIONEND,
  requestAnimFrame,
};
