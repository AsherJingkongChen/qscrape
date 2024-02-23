/**
 * ## Introduction
 * A reference holds a resource link and name
 */
export class Reference {
  link: string;
  name: string;

  /**
   * ## Introduction
   * Creates a reference from a resource link and name
   *
   * ## Parameters
   * - `link`: `string`
   *   + A URL
   * - `name`: `string | null | undefined`
   *   + A resource name
   *   + It defaults to the hostname of `link`
   *
   * ## Note
   * - The constructor uses `URL.constructor` to parse the link
   */
  constructor(link: string, name?: string | null);

  /**
   * ## Introduction
   * Clones a reference
   *
   * ## Parameters
   * - `source`: `Reference`
   *   + A reference to clone
   */
  constructor(source: Reference);

  constructor(...args: unknown[]) {
    if (typeof args[0] === 'string') {
      const url = new URL(args[0]);
      this.link = url.href;
      if (!args[1]) {
        this.name = url.hostname;
      } else if (typeof args[1] === 'string') {
        this.name = args[1];
      } else {
        throw new TypeError('The second argument is invalid');
      }
    } else if (args[0] instanceof Reference && !args[1]) {
      this.link = args[0].link;
      this.name = args[0].name;
    } else {
      throw new TypeError('The arguments are invalid');
    }
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
