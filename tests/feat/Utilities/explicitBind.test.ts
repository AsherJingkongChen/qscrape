import { explicitBind } from 'src/feat';
import { describe, expect, it } from 'vitest';

describe('explicitBind()', () => {
  it('It returns a function', () => {
    expect(explicitBind(() => {})).toBeTypeOf('function');
  });

  it('It returns an array-like object and the source function is at index 0', () => {
    const opt = { index: 4 };
    // NOTE: length is controlled by the bound function
    expect(explicitBind(charAt, 'Hello', opt)).toHaveLength(0);
    expect(explicitBind(charAt, 'Hello', opt)[0]).toBe(charAt);
    expect(explicitBind(charAt, 'Hello', opt)[1]).toBe('Hello');
    expect(explicitBind(charAt, 'Hello', opt)[2]).toBe(opt);
    expect(explicitBind(charAt, 'Hello', opt)[3]).toBeUndefined();

    expect(explicitBind(charAt, 'Hello')).toHaveLength(0);
    expect(explicitBind(charAt, 'Hello')[0]).toBe(charAt);
    expect(explicitBind(charAt, 'Hello')[1]).toBe('Hello');
    expect(explicitBind(charAt, 'Hello')[2]).toBeUndefined();
  });

  it('It returns the bound function which returns the correct value', () => {
    const opt = { index: 4 };
    expect(explicitBind(charAt, 'Hello', opt)()).toBe('o');
    expect(explicitBind(charAt, 'Hello')()).toBe('H');
    expect(explicitBind(charAt, '')()).toBe('');
  });

  function charAt(str: string, opt?: { index: number }): string {
    return str[opt?.index ?? 0] ?? '';
  }
});
