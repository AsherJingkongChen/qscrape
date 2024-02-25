import { QScrapePrompts } from '../prompts';
import { Reference, Queue } from '../../../core';

/**
 * ## Introduction
 * Handles the main tasks of `QScrape`
 *
 * ## Returns
 * - `Promise<void>`
 *   + Resolves when the main tasks have been completed
 */
export async function QScrapeMain(): Promise<void> {
  for (const reference of new Queue([
    new Reference(
      await QScrapePrompts.referenceLink()(),
      await QScrapePrompts.referenceName()(),
    ),
  ])) {
    console.log(reference.toString());
    console.log(await QScrapePrompts.confirmation()());
  }
}

export namespace QScrapeMain {}
