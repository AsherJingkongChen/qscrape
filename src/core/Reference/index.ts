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
   * Extracts references from an HTML element
   *
   * ## Parameters
   * - `html`: `HTMLElement`
   *   + An HTML element
   *
   * ## Returns
   * - `Reference[]`
   *   + References extracted from `html`
   */
  static fromHtml(html: HTMLElement): Reference[] {
    const results = new Array<Reference>();
    for (const anchor of html.getElementsByTagName('a')) {
      results.push(new Reference(anchor.href, anchor.textContent));
    }
    return results;
  }

  /**
   * ## Introduction
   * Extracts references from text data
   *
   * ## Parameters
   * - `text`: `string`
   *   + A text data
   *
   * ## Returns
   * - `Reference[]`
   *   + References extracted from `text`
   */
  static fromText(text: string): Reference[] {
    return (
      text
        .match(/\bhttps?:\/\/[!-~]+\b/gi)
        ?.map((link) => new Reference(link)) ?? []
    );
  }
}
