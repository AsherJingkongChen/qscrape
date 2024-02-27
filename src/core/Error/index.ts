/**
 * ## Introduction
 * A quiet error should not be reported to the user
 *
 * ## Note
 * - It can be used to stop the program silently
 */
export class QuietError extends Error {
  override name = 'QuietError';

  /**
   * ## Introduction
   * Creates a quiet error
   */
  constructor() {
    super();
  }
}
