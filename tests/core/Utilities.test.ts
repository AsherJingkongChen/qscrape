import { explicitBind } from 'src/core';
import { describe, expect, it } from 'vitest';

describe('explicitBind()', () => {
  it('It returns a function', () => {
    expect(explicitBind(() => {})).toBeTypeOf('function');
  });

  it('It returns an array-like object', () => {
    const opt = { index: 4 };
    // NOTE: length is controlled by the bound function
    expect(explicitBind(charAt, 'Hello', opt)).toHaveLength(0);
    expect(explicitBind(charAt, 'Hello', opt)[0]).toBe(charAt);
    expect(explicitBind(charAt, 'Hello', opt)[1]).toBe('Hello');
    expect(explicitBind(charAt, 'Hello', opt)[2]).toBe(opt);
    expect(explicitBind(charAt, 'Hello', opt)[3]).toBeUndefined();

    expect(explicitBind(charAt, 'World!')).toHaveLength(0);
    expect(explicitBind(charAt, 'World!')[0]).toBe(charAt);
    expect(explicitBind(charAt, 'World!')[1]).toBe('World!');
    expect(explicitBind(charAt, 'World!')[2]).toBeUndefined();
  });

  it('It returns an iterable object', () => {
    const opt = { index: 4 };
    expect(Array.from(explicitBind(charAt, 'Hello', opt))).toEqual([
      charAt,
      'Hello',
      opt,
    ]);
    expect(Array.from(explicitBind(charAt, 'the World!'))).toEqual([
      charAt,
      'the World!',
    ]);
  });

  it('It returns the bound function which returns the correct value', () => {
    const opt = { index: 1 };
    expect(explicitBind(charAt, 'Ok', opt)()).toBe('k');
    expect(explicitBind(charAt, 'Ok')()).toBe('O');
    expect(explicitBind(charAt, '')()).toBe('');
  });

  function charAt(str: string, opt?: { index: number }): string {
    return str[opt?.index ?? 0] ?? '';
  }
});
