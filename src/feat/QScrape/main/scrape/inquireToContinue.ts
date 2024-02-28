import { context } from '../../context';
import { prompt } from '../../prompt';
import cl from 'chalk';
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
 * - It depends on `context`
 */
export async function inquireToContinue(): Promise<boolean> {
  context.streams.output.write(
    prompt`There are ${cl.cyan(context.result.length)} saved resources.`,
  );
  return await select(
    {
      choices: [
        { name: `Yes, let's continue.`, value: true },
        { name: 'No.', value: false },
      ],
      default: true,
      message: 'Do you want to continue to explore?',
    },
    context.streams,
  );
}
