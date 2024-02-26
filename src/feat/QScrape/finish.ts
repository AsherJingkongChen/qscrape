import { QScrapeContext } from './context';

/**
 * ## Introduction
 * Handles the post tasks of `QScrape`
 *
 * ## Note
 * - This function should not throw
 */
export function QScrapeFinish(): void {
  console.warn('QScrape has finished running!');
  console.log(QScrapeContext.result);

  // Clear the result after processing it
  QScrapeContext.result.splice(0, QScrapeContext.result.length);
}

export namespace QScrapeFinish {}
