import type { QScrape } from '.';

export const error: QScrape['error'] = function error(error) {
  if (!(error instanceof Error)) {
    throw error;
  }
  /**
   * ## Notes
   * `process.exitCode` is set if receiving a special error
   *
   * ## References
   * - [Node.js `process.exitCode`](https://nodejs.org/api/process.html#process_exit_codes)
   */
  if (error.message.startsWith('User force closed the prompt')) {
    // SIGINT: 2
    process.exitCode = 128 + 2;
    return;
  }
  throw error;
};
