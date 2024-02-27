import { context } from '../../context';
import { state } from './state';
import select from '@inquirer/select';

/**
 * ## Introduction
 * Inquires if the user wants to rename the resource
 *
 * ## Returns
 * - `Promise<void>`
 *   + Resolves when the user has finished renaming
 *
 * ## Note
 * - It depends on `state`
 */
export async function inquireToRename(): Promise<void> {
  state.name = await select(
    {
      choices: [
        { name: state.altName, value: state.altName },
        { name: state.name, value: state.name },
      ],
      default: state.altName,
      message: 'Name the resource:',
    },
    context.streams,
  );
}
