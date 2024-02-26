import type { QScrape } from '.';
import { Resource } from '../../core';

export const context: QScrape['context'] = {
  result: [] as Resource[],
  streams: {
    input: process.stdin as NodeJS.ReadableStream,
    output: process.stdout as NodeJS.WritableStream,
  },
};
