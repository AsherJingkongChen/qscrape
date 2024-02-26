import { QScrapeMain } from './main';

/**
 * ## Introduction
 * Handles post tasks of `QScrape`
 *
 * ## Parameters
 * - `result`: `QScrapeMain.Result | undefined`
 *   + The result of main tasks
 *   + It won't process the result if `undefined` is given
 *
 * ## Note
 * - This function should not throw
 */
export function QScrapeFinish(result?: QScrapeMain.Result): void {
  console.warn('QScrape has finished running!');
  console.log({ result });
}

export namespace QScrapeFinish {}
