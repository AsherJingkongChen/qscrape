import { context } from '../context';
import input from '@inquirer/input';

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
