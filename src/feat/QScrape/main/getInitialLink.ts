import { context } from '../context';
import input from '@inquirer/input';

/**
 * ## Introduction
 * Gets the initial link for `QScrape.main` to explore from
 * 
 * ## Returns
 * - `Promise<string>`
 *   + Resolves to the initial link to scrape
 */
export async function getInitialLink(): Promise<string> {
  return await input(
    {
      default: 'https://example.com/',
      message: 'Enter a link:',
      validate(value) {
        try {
          new URL(value);
          return true;
        } catch {
          return 'You must provide a valid URL';
        }
      },
    },
    context.streams,
  );
}
