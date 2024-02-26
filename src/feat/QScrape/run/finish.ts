import { QScrapeMain } from './main';

/**
 * ## Introduction
 * Handles post tasks of `QScrape`
 *
 * ## Note
 * - This function should not throw
 */
export function QScrapeFinish(): void {
  console.warn('QScrape has finished running!');
  console.log(QScrapeMain);

  // Clear the result after processing it
  QScrapeMain.result.splice(0, QScrapeMain.result.length);
}

export namespace QScrapeFinish {}
