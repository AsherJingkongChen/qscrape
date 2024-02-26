import type { QScrape } from '.';
import { context } from './context';
import { EOL } from 'os';

export const finish: QScrape['finish'] = function finish() {
  console.warn('QScrape has finished running!');

  const markdownResult = {
    start: '---',
    heading: '## Resources',
    resourceList: `- ${context.result.join(`${EOL}- `)}${EOL}`,
  };
  context.streams.output.write(Object.values(markdownResult).join(EOL));
  context.result.splice(0, context.result.length);
};
