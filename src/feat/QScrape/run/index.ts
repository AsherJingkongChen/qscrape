import { QScrapeError } from './error';
import { QScrapeFinish } from './finish';
import { QScrapeMain } from './main';

/**
 * ## Introduction
 * Runs `QScrape`
 *
 * ## Returns
 * - `Promise<true>`
 *   + Resolves when the main tasks has finished running
 */
export async function QScrapeRun(): Promise<true> {
  let result: QScrapeMain.Result | undefined;
  try {
    result = await QScrapeMain();
  } catch (error) {
    QScrapeError(error);
  } finally {
    QScrapeFinish(result);
  }
  return true;
}

export namespace QScrapeRun {
  export import error = QScrapeError;
  export import finish = QScrapeFinish;
  export import main = QScrapeMain;
}

export * from './error';
export * from './finish';
export * from './main';