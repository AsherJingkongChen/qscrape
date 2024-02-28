import { Resource } from '../../core';
import { context } from './context';
import { error } from './error';
import { finish } from './finish';
import { main } from './main';
import { prompt } from './prompt';
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
   * Get a pretty prompt
   *
   * ## Parameters
   * - `template.raw`: `readonly string[]`
   *   + Raw literals that will be set to bold
   * - `...substitutions`: `any[]`
   *   + Values to interpolate into the template
   *
   * ## Returns
   * - `string`
   *   + A prompt decorated with `chalk`
   *
   * ## Examples
   * - The Output is "> **1 + 1 ==** 2 **is** true"
   *
   *   ```javascript
   *   prompt`1 + 1 == ${1 + 1} is ${true}`;
   *   ```
   */
  prompt(template: { raw: readonly string[] }, ...substitutions: any[]): string;

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
  prompt,
  run,
};
