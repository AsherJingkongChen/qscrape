import { Resource } from 'src/core';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

describe('new Resource()', () => {
  it('It clones itself', () => {
    const ref = new Resource('https://example.com/');
    const clone = new Resource(ref);
    expect(clone).not.toBe(ref);
    expect(clone).toEqual(ref);
  });

  it('Its default name is the host of link', () => {
    const link = 'https://example.com/';
    expect(new Resource(link).name).toBe('example.com');
    expect(new Resource(link, '').name).toBe('example.com');
    expect(new Resource(link, null).name).toBe('example.com');
  });

  it('It throws if parameters are invalid', () => {
    expect(() => new Resource(0 as any)).toThrow(TypeError);
    expect(() => new Resource('https://example.com/', 0 as any)).toThrow(
      TypeError,
    );
    expect(() => new Resource(0 as any, 'Example Domain')).toThrow(TypeError);
    expect(
      () => new (Resource as any)('https://example.com/', 'Example Domain', 0),
    ).toThrow(TypeError);
  });
});

describe('Resource.prototype.toString()', () => {
  it('Its result contains the resource link and name', () => {
    const link = 'https://example.com/';
    const name = 'Example';
    const ref = new Resource(link, name);
    const string = ref.toString();
    expect(string).toContain(name);
    expect(string).toContain(link);
  });
});

import DataForResourceFromHtml from 'tests/testUtils/data/example-com.html.json';

describe('Resource.fromHtml()', () => {
  it('It extracts the exact links and names', () => {
    const { document } = new JSDOM(DataForResourceFromHtml).window;
    const refs = Array.from(Resource.fromHtml(document));
    expect(refs.length).toBe(1);

    expect(refs[0]!.link).toBe('https://www.iana.org/domains/example');
    expect(refs[0]!.name).toBe('More information...');
  });
});

import DataForResourceFromText from 'tests/testUtils/data/application-java-archive-media-type-assignment.txt.json';

describe('Resource.fromText()', () => {
  it('It returns an empty array if no links are found', () => {
    expect(Array.from(Resource.fromText('No http links here')).length).toBeFalsy();
    expect(Array.from(Resource.fromText('http://%invalid%')).length).toBeFalsy();
  });

  it('It extracts the exact links and names', () => {
    const refs = Array.from(Resource.fromText(DataForResourceFromText));
    expect(refs.length).toBe(3);

    expect(refs[0]!.link).toBe('https://jcp.org/en/jsr/detail?id=394');
    expect(refs[0]!.name).toBe('jcp.org');

    expect(refs[1]!.link).toBe('https://jcp.org/');
    expect(refs[1]!.name).toBe('jcp.org');

    expect(refs[2]!.link).toBe('https://openjdk.org/projects/jdk');
    expect(refs[2]!.name).toBe('openjdk.org');
  });
});
