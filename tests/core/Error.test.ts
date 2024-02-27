import { QuietError } from 'src/core';
import { describe, expect, it } from 'vitest';

describe('QuietError', () => {
  it('It is an instance of `Error`', () => {
    expect(new QuietError()).toBeInstanceOf(Error);
  });

  it('Its name is `QuietError`', () => {
    expect(new QuietError().name).toBe('QuietError');
  });

  it('It does not have a message', () => {
    expect(new QuietError().message).toBeFalsy();
    expect(new (QuietError as any)('something').message).toBeFalsy();
  });
});
