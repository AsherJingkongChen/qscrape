/**
 * ## Introduction
 * A reference holds a resource link and name
 */
export type ReferenceLike = {
  link: string;
  name: string;
};

/**
 * ## Introduction
 * A reference holds a resource link and name
 */
export class Reference implements ReferenceLike {
  readonly link: string;
  readonly name: string;

  /**
   * ## Introduction
   * Creates a reference from a resource link and name
   *
   * ## Parameters
   * - `link`: `string`
   *   + A URL
   * - `name`: `string | null | undefined`
   *   + A resource name
   *   + It defaults to the host of `link`
   *
   * ## Note
   * - The constructor uses `URL.constructor` to parse the link
   */
  constructor(link: string, name?: string | null);

  /**
   * ## Introduction
   * Creates a reference by copying properties from another object
   *
   * ## Parameters
   * - `source`: `ReferenceLike`
   *   + An object to copy properties from
   */
  constructor(source: ReferenceLike);

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
          this.link = args[0].link;
          this.name = args[0].name;
        } else {
          throw new TypeError(`The first argument is invalid: ${args[0]}`);
        }
        break;
      case 2:
        if (typeof args[0] === 'string') {
          const url = new URL(args[0]);
          this.link = url.href;
          if (typeof args[1] === 'string' || args[1] === null) {
            this.name = args[1] || url.host;
          } else {
            throw new TypeError(`The second argument is invalid: ${args[1]}`);
          }
        } else {
          throw new TypeError(`The first argument is invalid: ${args[0]}`);
        }
        break;
      default:
        throw new TypeError(
          `The number of arguments is incorrect: ${args.length}`,
        );
    }
    Object.freeze(this);
  }

  /**
   * ## Introduction
   * Converts a reference to a string
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
   * Extracts references from an HTML document
   *
   * ## Parameters
   * - `html`: `Document`
   *   + An HTML Document
   *
   * ## Yields
   * - `Reference`
   *   + A reference extracted from `html.body`
   */
  static *fromHtml(html: Document): Generator<Reference> {
    const { body, location } = html;
    for (const anchor of body.getElementsByTagName('a')) {
      const link = new URL(anchor.href, location.href).href;
      yield new Reference(link, anchor.textContent);
    }
  }

  /**
   * ## Introduction
   * Extracts references from text data
   *
   * ## Parameters
   * - `text`: `string`
   *   + A text data
   *
   * ## Yields
   * - `Reference`
   *   + A reference extracted from `text`
   */
  static *fromText(text: string): Generator<Reference> {
    for (const link of text.match(/\bhttps?:\/\/[!-~]+\b/gi) ?? []) {
      try {
        yield new Reference(link);
      } catch {
        // Ignore invalid references
        continue;
      }
    }
  }
}
