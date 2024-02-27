import { Resource } from '../../../../core';
import { context } from '../../context';
import { state } from './state';
import select from '@inquirer/select';

/**
 * ## Introduction
 * Inquires if the user wants to save the resource
 *
 * ## Returns
 * - `Promise<boolean>`
 *   + Resolves to `true` if the user has finished saving, otherwise `false`.
 *
 * ## Note
 * - It depends on `context` and `state`
 */
export async function inquireToSave(): Promise<boolean> {
  if (
    await select(
      {
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ],
        default: true,
        message: 'Do you want to save this resource?',
      },
      context.streams,
    )
  ) {
    // Saves the resource
    context.result.push(new Resource(state.link, state.name));
    return true;
  }
  return false;
}
