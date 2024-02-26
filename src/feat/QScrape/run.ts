import type { QScrape } from '.';
import { error } from './error';
import { finish } from './finish';
import { main } from './main';

export const run: QScrape['run'] = async function run() {
  await main().catch(error).finally(finish);
  return true;
};
