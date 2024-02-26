import { Resource } from '../../core';

/**
 * `QScrape.context`
 */
export const context = Object.freeze({
  result: [] as Resource[],
  streams: {
    input: process.stdin as NodeJS.ReadableStream,
    output: process.stdout as NodeJS.WritableStream,
  },
});
