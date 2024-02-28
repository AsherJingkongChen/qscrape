import { QuietError } from 'src/core';
import { QScrape } from 'src/feat';
import { describe, expect, it } from 'vitest';
import cl from 'chalk';

describe('QScrape.prompt()', () => {
  it('It does only set raw literals to bold', () => {
    expect(QScrape.prompt`1 + 1 == ${2} is ${true}`).toBe(
      cl.green('> ') +
        cl.bold('1 + 1 == ') +
        '2' +
        cl.bold(' is ') +
        'true'
    );
  });
});

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

  describe('It handles special errors differently', () => {
    it('Error: User force closed the prompt ...', () => {
      QScrape.error(new Error('User force closed the prompt ...'));
      expect(process.exitCode).toBeGreaterThanOrEqual(128);
      process.exitCode = 0;
    });

    it('QuietError', () => {
      expect(() => QScrape.error(new QuietError())).not.toThrow();
    });
  });
});
