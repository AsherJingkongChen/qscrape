#! /usr/bin/env node
import { QScrape } from './lib';

/**
 * ## Introduction
 * Runs the QScrape and waits for it finish
 *
 * ## Layout
 * - `Promise<true>`
 *   + Resolves when the QScrape has finished running
 *
 * ## Note
 * - This is a result of `QScrape.run()`
 */
export const hasQScrapeFinished = QScrape.run();
