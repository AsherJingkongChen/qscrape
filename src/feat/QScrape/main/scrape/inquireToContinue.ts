import { context } from '../../context';
import select from '@inquirer/select';

/**
 * ## Introduction
 * Inquires if the user wants to continue to scrape the next resource
 *
 * ## Returns
 * - `Promise<boolean>`
 *   + Resolves to `true` if the user wants to continue, otherwise `false`.
 *
 * ## Note
 * - It depends on `context.result`
 */
export async function inquireToContinue(): Promise<boolean> {
  return await select(
    {
      choices: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
      default: true,
      message:
        `Total ${context.result.length} resources are saved. ` +
        'Do you want to continue to explore?',
    },
    context.streams,
  );
}
