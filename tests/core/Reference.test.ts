import { Reference } from 'src/core';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

describe('new Reference()', () => {
  it('It clones itself', () => {
    const ref = new Reference('https://example.com/');
    const clone = new Reference(ref);
    expect(clone).not.toBe(ref);
    expect(clone).toEqual(ref);
  });

  it('Its default name is the host of link', () => {
    const link = 'https://example.com/';
    expect(new Reference(link).name).toBe('example.com');
    expect(new Reference(link, '').name).toBe('example.com');
  });

  it('It throws if parameters are invalid', () => {
    expect(() => new Reference(0 as any)).toThrow(TypeError);
    expect(() => new Reference('https://example.com/', 1 as any)).toThrow(
      TypeError,
    );
  });
});

describe('Reference.prototype.toString()', () => {
  it('Its result contains the reference link and name', () => {
    const link = 'https://example.com/';
    const name = 'Example';
    const ref = new Reference(link, name);
    const string = ref.toString();
    expect(string).toContain(name);
    expect(string).toContain(link);
  });
});

import DataForReferenceFromHtml from 'tests/testUtils/data/example-com.html.json';

describe('Reference.fromHtml()', () => {
  it('It extracts the exact links and names', () => {
    const { document } = new JSDOM(DataForReferenceFromHtml).window;
    const refs = Reference.fromHtml(document.documentElement);
    expect(refs.length).toBe(1);

    expect(refs[0]!.link).toBe('https://www.iana.org/domains/example');
    expect(refs[0]!.name).toBe('More information...');
  });
});

import DataForReferenceFromText from 'tests/testUtils/data/application-java-archive-media-type-assignment.txt.json';

describe('Reference.fromText()', () => {
  it('It returns an empty array if no links are found', () => {
    const refs = Reference.fromText('No http links here');
    expect(refs.length).toBeFalsy();
  });

  it('It extracts the exact links and names', () => {
    const refs = Reference.fromText(DataForReferenceFromText);
    expect(refs.length).toBe(3);

    expect(refs[0]!.link).toBe('https://jcp.org/en/jsr/detail?id=394');
    expect(refs[0]!.name).toBe('jcp.org');

    expect(refs[1]!.link).toBe('https://jcp.org/');
    expect(refs[1]!.name).toBe('jcp.org');

    expect(refs[2]!.link).toBe('https://openjdk.org/projects/jdk');
    expect(refs[2]!.name).toBe('openjdk.org');
  });
});
