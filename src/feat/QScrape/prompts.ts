import { confirm, input } from '@inquirer/prompts';
import { explicitBind } from '../../core';

/**
 * ## Introduction
 * `QScrape.prompts` provides methods to interact with the user
 */
export namespace QScrapePrompts {
  /**
   * ## Introduction
   * Gets a prompt to fetch a confirmation from the user
   *
   * ## Parameters
   * - `message`: `string | undefined`
   *   + A message to display
   *   + It defaults to `Continue?`
   *
   * ## Returns
   * - `ExplicitBoundFunction`
   *   + A prompt function
   */
  export function confirmation(message?: string) {
    return explicitBind(confirm, {
      default: true,
      message: message ?? 'Continue?',
    });
  }

  /**
   * ## Introduction
   * Gets a prompt to fetch a reference link from the user
   *
   * ## Parameters
   * - `placeholder`: `string | undefined`
   *   + A placeholder for the input
   *   + It defaults to `https://example.com/`
   *
   * ## Returns
   * - `ExplicitBoundFunction`
   *   + A prompt function
   *
   * ## Note
   * - The input should be a valid URL
   */
  export function referenceLink(placeholder?: string) {
    return explicitBind(input, {
      default: placeholder ?? 'https://example.com/',
      message: 'Enter the reference link:',
      validate(value) {
        try {
          new URL(value);
          return true;
        } catch {
          return 'You must provide a valid URL';
        }
      },
    });
  }

  /**
   * ## Introduction
   * Gets a prompt to fetch a reference name from the user
   *
   * ## Parameters
   * - `placeholder`: `string | undefined`
   *   + A placeholder for the input
   *   + It defaults to `Example Domain`
   *
   * ## Returns
   * - `ExplicitBoundFunction`
   *   + A prompt function
   */
  export function referenceName(placeholder?: string) {
    return explicitBind(input, {
      default: placeholder ?? 'Example Domain',
      message: 'Enter the reference name:',
    });
  }
}
