import { QScrape } from 'src/feat';
import { describe, expect, it } from 'vitest';

describe('QScrape.run.finish()', () => {
  it('It does not throw', () => {
    expect(QScrape.run.finish).not.toThrow();
  });
});
describe('QScrape.run.error()', () => {
  it('It throws for general errors', () => {
    expect(QScrape.run.error.bind(null, new Error())).toThrow();
    expect(QScrape.run.error.bind(null, 'An error occurred')).toThrow();
  });

  describe('It sends signal exit code when receiving special errors', () => {
    it('Error: User force closed the prompt ...', () => {
      QScrape.run.error(new Error('User force closed the prompt ...'));
      expect(process.exitCode).toBeGreaterThanOrEqual(128);
      process.exitCode = 0;
    });
  });
});
