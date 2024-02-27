import select from '@inquirer/select';
import { context } from '../../context';
import { ExternalEditor } from 'external-editor';
import { state } from './state';

/**
 * ## Introduction
 * Inquires if the user wants to view the resource content
 *
 * ## Returns
 * - `Promise<boolean>`
 *   + Resolves to `true` if the user has finished viewing, otherwise `false`.
 *
 * ## Note
 * - It depends on `state`
 */
export async function inquireToViewContent(): Promise<boolean> {
  if (
    await select(
      {
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ],
        default: false,
        message: 'Do you want to view the content?',
      },
      context.streams,
    )
  ) {
    // Shows the content in a read-only editor
    const editor = new ExternalEditor(state.textContent, {
      mode: 0o444,
      postfix: `.txt`,
      prefix: 'QScrape-',
    });
    editor.editor.bin = '/usr/bin/less';
    editor.run();
    return true;
  }
  return false;
}
