/**
 * ## Introduction
 * A resource holds a link and its name
 */
export type ResourceLike = {
  link: string;
  name: string;
};

/**
 * ## Introduction
 * A resource holds a link and its name
 */
export class Resource implements ResourceLike {
  readonly link: string;
  readonly name: string;

  /**
   * ## Introduction
   * Creates a resource from a link and a name
   *
   * ## Parameters
   * - `link`: `string`
   *   + A URL
   * - `name`: `string | null | undefined`
   *   + A resource name
   *   + It defaults to the host of `link`
   *
   * ## Note
   * - It uses `URL.constructor` to parse the link
   */
  constructor(link: string, name?: string | null);

  /**
   * ## Introduction
   * Creates a resource by copying properties from an object
   *
   * ## Parameters
   * - `source`: `ResourceLike`
   *   + An object to copy properties from
   */
  constructor(source: ResourceLike);

  constructor(...args: any[]) {
    switch (args.length) {
      case 1:
        if (typeof args[0] === 'string') {
          const url = new URL(args[0]);
          this.link = url.href;
          this.name = url.host;
        } else if (
          typeof args[0]?.link === 'string' &&
          typeof args[0]?.name === 'string'
        ) {
          const url = new URL(args[0].link);
          this.link = url.href;
          this.name = args[0].name || url.host;
        } else {
          throw new TypeError(`The first parameter is invalid: ${args[0]}`);
        }
        break;
      case 2:
        if (typeof args[0] === 'string') {
          const url = new URL(args[0]);
          this.link = url.href;
          if (typeof args[1] === 'string' || args[1] === null) {
            this.name = args[1] || url.host;
          } else {
            throw new TypeError(`The second parameter is invalid: ${args[1]}`);
          }
        } else {
          throw new TypeError(`The first parameter is invalid: ${args[0]}`);
        }
        break;
      default:
        throw new TypeError(
          `The number of parameters is incorrect: ${args.length}`,
        );
    }
    Object.freeze(this);
  }

  /**
   * ## Introduction
   * Converts a resource to a string
   *
   * ## Note
   * - The string format adapts Markdown syntax: `[name](link)`
   *   + Therefore, It can be used in Markdown files and very easy to read.
   */
  toString(): string {
    return `[${this.name}](${this.link})`;
  }

  /**
   * ## Introduction
   * Finds resources from an HTML document
   *
   * ## Parameters
   * - `html`: `Document`
   *   + An HTML Document
   *
   * ## Yields
   * - `Resource`
   *   + A resource extracted from `html.body`
   */
  static *fromHtml(html: Document): Generator<Resource> {
    const { body, location } = html;
    for (const anchor of body.getElementsByTagName('a')) {
      const link = new URL(anchor.href, location.href).href;
      yield new Resource(link, anchor.textContent);
    }
  }

  /**
   * ## Introduction
   * Finds resources from text data
   *
   * ## Parameters
   * - `text`: `string`
   *   + A text data
   *
   * ## Yields
   * - `Resource`
   *   + A resource extracted from `text`
   */
  static *fromText(text: string): Generator<Resource> {
    for (const link of text.match(/\bhttps?:\/\/[!-~]+\b/gi) ?? []) {
      try {
        yield new Resource(link);
      } catch {
        // Ignore invalid resources
        continue;
      }
    }
  }
}
