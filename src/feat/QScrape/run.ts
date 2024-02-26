import { error } from './error';
import { finish } from './finish';
import { main } from './main';

/**
 * `QScrape.run`
 */
export async function run(): Promise<true> {
  await main().catch(error).finally(finish);
  return true;
}
