/**
 * Custom exception classes for game logic
 */

/**
 * Exception thrown when there's an issue with looting items
 */
export class LootException extends Error {
  /**
   * Create a new LootException
   * @param message - Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'LootException';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LootException);
    }
  }
}

/**
 * Legacy export for backward compatibility
 */
export const Exceptions = {
  LootException,
};

export default Exceptions;
