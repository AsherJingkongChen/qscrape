import { Resource } from '../../core';
import { context } from './context';
import { error } from './error';
import { finish } from './finish';
import { main } from './main';
import { run } from './run';

/**
 * ## Introduction
 * `QScrape` helps you explore the Web as a simple web page scraper.
 */
export type QScrape = {
  /**
   * ## Introduction
   * The context of `QScrape`
   */
  context: {
    /**
     * ## Introduction
     * The result of `QScrape.main`
     *
     * ## Layout
     * - `Resource[]`
     *   + The scraped resources
     */
    result: Resource[];

    /**
     * ## Introduction
     * The input and output streams for `QScrape`
     */
    streams: {
      /**
       * ## Introduction
       * The input stream for `QScrape`
       *
       * ## Layout
       * - `NodeJS.ReadableStream`
       *     + A Node.js readable stream
       *     + It defaults to `process.stdin`
       */
      input: NodeJS.ReadableStream;
      /**
       * ## Introduction
       * The output stream for `QScrape`
       *
       * ## Layout
       * - `NodeJS.WritableStream`
       *   + A Node.js writable stream
       *   + It defaults to `process.stdout`
       */
      output: NodeJS.WritableStream;
    };
  };

  /**
   * ## Introduction
   * Handles an error thrown from `QScrape`
   *
   * ## Parameters
   * - `error`: `unknown`
   *   + An unknown error
   *
   * ## Note
   * - It throws for general errors
   * - It doesn't throw for signal errors
   *   + e.g. If a user sends `SIGINT`,
   *     the program will exit asynchronously with the signal exit code `128 + 2`
   */
  error(error: unknown): void;

  /**
   * ## Introduction
   * Handles the post tasks after calling `QScrape.main`
   *
   * ## Note
   * - This function should not throw
   * - It resets `QScrape.context.result`
   */
  finish(): void;

  /**
   * ## Introduction
   * Handles the main tasks of `QScrape`
   *
   * ## Returns
   * - `Promise<void>`
   *   + Resolves when the main tasks have been completed
   */
  main(): Promise<void>;

  /**
   * ## Introduction
   * Runs `QScrape` module
   *
   * ## Returns
   * - `Promise<true>`
   *   + Resolves when the all tasks of `QScrape` has finished successfully
   */
  run(): Promise<true>;
};

export const QScrape: QScrape = {
  context,
  error,
  finish,
  main,
  run,
};
