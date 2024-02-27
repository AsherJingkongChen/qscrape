import type { QScrape } from '.';
import { QuietError } from '../../core';

export const error: QScrape['error'] = function error(error) {
  if (!(error instanceof Error)) {
    throw error;
  }

  // `QuietError` is a special error that should be ignored
  if (error instanceof QuietError) {
    return;
  }

  /**
   * ## Notes
   * `process.exitCode` is set if receiving a signal error
   *
   * ## References
   * - [Node.js process.exitCode](https://nodejs.org/api/process.html#process_exit_codes)
   */
  if (error.message.startsWith('User force closed the prompt')) {
    // SIGINT: 2
    process.exitCode = 128 + 2;
    return;
  }

  throw error;
};
