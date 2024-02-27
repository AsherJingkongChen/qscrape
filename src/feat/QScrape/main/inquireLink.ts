import { context } from '../context';
import input from '@inquirer/input';

/**
 * ## Introduction
 * Inquires a resource link to scrape
 * 
 * ## Returns
 * - `Promise<string>`
 *   + Resolves to a resource link
 */
export async function inquireLink(): Promise<string> {
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
