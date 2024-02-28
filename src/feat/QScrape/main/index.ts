import type { QScrape } from '..';
import { Resource, Queue } from '../../../core';
import { prompt } from '../prompt';
import { inquireLink } from './inquireLink';
import { scrape } from './scrape';
import cl from 'chalk';

export const main: QScrape['main'] = async function main() {
  // Shows the program heading
  prompt`Q-Scrape: ${cl.bold.italic('Explore the Web')}`;

  // Runs the loop until the user decides to quit
  while (true) {
    // Starts to explore the Web
    const resources = new Queue([new Resource(await inquireLink())]);
    while (await scrape(resources));
  }
};
