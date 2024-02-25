import { EOL } from 'os';
import { stdout } from 'process';

/**
 * ## Introduction
 * Handles post tasks of `QScrape`
 *
 * ## Note
 * - This function should not throw
 */
export function QScrapeFinish(): void {
  stdout.end(EOL);
}

export namespace QScrapeFinish {}
