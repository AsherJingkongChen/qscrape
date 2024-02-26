import { Resource } from '../../core';

export namespace QScrapeContext {
  /**
   * ## Introduction
   * The input and output streams for `QScrape`
   *
   * ## Layout
   * - `Object`
   *   - `input`: `NodeJS.ReadableStream`
   *     + A Node.js readable stream
   *     + It defaults to `process.stdin`
   *   - `output`: `NodeJS.WritableStream`
   *     + A Node.js writable stream
   *     + It defaults to `process.stdout`
   */
  export const streams = {
    input: process.stdin as NodeJS.ReadableStream,
    output: process.stdout as NodeJS.WritableStream,
  };

  /**
   * ## Introduction
   * The result of `QScrape.main`
   *
   * ## Layout
   * - `Resource[]`
   *   + The scraped resources
   */
  export const result: Resource[] = [];
}
