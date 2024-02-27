import type { QScrape } from '..';
import { Resource, Queue } from '../../../core';
import { context } from '../context';
import { inquireLink } from './inquireLink';
import { EOL } from 'os';
import { scrape } from './scrape';

export const main: QScrape['main'] = async function main() {
  // Shows the program heading
  context.streams.output.write(`> Q-Scrape: Explore the Web${EOL}`);

  // Runs the loop until the user decides to quit
  while (true) {
    // Starts to explore the Web
    const resources = new Queue([new Resource(await inquireLink())]);
    while (await scrape(resources));
  }
};
