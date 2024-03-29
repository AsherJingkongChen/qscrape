import type { QScrape } from '.';
import cl from 'chalk';

export const prompt: QScrape['prompt'] = function prompt(
  template,
  ...substitutions
) {
  return (
    cl.green('> ') +
    String.raw({ raw: template.raw.map((s) => cl.bold(s)) }, ...substitutions)
  );
};
