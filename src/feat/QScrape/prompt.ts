import type { QScrape } from '.';
import { context } from './context';
import cl from 'chalk';
import { EOL } from 'os';

export const prompt: QScrape['prompt'] = function prompt(
  template,
  ...substitutions
) {
  context.streams.output.write(
    cl.green('> ') +
      String.raw(
        { raw: template.raw.map((s) => cl.bold(s)) },
        ...substitutions,
      ) +
      EOL,
  );
};
