/**
 * ## Introduction
 * Handles an error of `QScrape`
 *
 * ## Parameters
 * - `error`: `unknown`
 *   + An unknown error
 *
 * ## Note
 * - It throws for general errors
 * - It doesn't throw for signal errors
 *   + e.g. If a user sends `SIGINT`,
 *     the program will exit asynchronously with the signal exit code `128 + 2`
 */
export function QScrapeError(error: unknown): void {
  if (!(error instanceof Error)) {
    throw error;
  }
  // A signal error
  if (error.message.startsWith('User force closed the prompt')) {
    // SIGINT exit code
    process.exitCode = 128 + 2;
    return;
  }
  throw error;
}

export namespace QScrapeError {}
