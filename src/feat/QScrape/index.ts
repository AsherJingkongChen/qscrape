import { QScrapePrompts } from './prompts';
import { QScrapeRun } from './run';

/**
 * ## Introduction
 * `QScrape` explores the Web. It works as a simple web page scraper.
 */
export namespace QScrape {
  export import prompts = QScrapePrompts;
  export import run = QScrapeRun;
}
