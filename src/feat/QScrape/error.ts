/**
 * `QScrape.error`
 */
export function error(error: unknown): void {
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
