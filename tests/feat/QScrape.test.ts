import { QScrape } from 'src/feat';
import { describe, expect, it } from 'vitest';

describe('QScrape.finish()', () => {
  it('It does not throw', () => {
    expect(QScrape.finish).not.toThrow();
  });
});

describe('QScrape.error()', () => {
  it('It throws for general errors', () => {
    expect(() => QScrape.error(new Error())).toThrow();
    expect(() => QScrape.error('An error occurred')).toThrow();
  });

  describe('It sends signal exit code when receiving special errors', () => {
    it('Error: User force closed the prompt ...', () => {
      QScrape.error(new Error('User force closed the prompt ...'));
      expect(process.exitCode).toBeGreaterThanOrEqual(128);
      process.exitCode = 0;
    });
  });
});
