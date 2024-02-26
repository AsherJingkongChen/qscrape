import { QScrapePrompts } from '../prompts';
import { Reference, Queue } from '../../../core';
import { EOL } from 'os';
import { JSDOM } from 'jsdom';
import { edit } from 'external-editor';

const mediaTypeToFileExtension = {
  'application/xhtml+xml': 'xhtml',
  'text/html': 'html',
  'text/plain': 'txt',
} as const;

/**
 * ## Introduction
 * Handles the main tasks of `QScrape`
 *
 * ## Returns
 * - `Promise<void>`
 *   + Resolves when the main tasks have been completed
 */
export async function QScrapeMain(): Promise<void> {
  const initialReferenceLink = await QScrapePrompts.referenceLink()();
  const initialReferenceName = await QScrapePrompts.referenceName(
    new Reference(initialReferenceLink).name,
  )();
  const referenceQueue = new Queue([
    new Reference(initialReferenceLink, initialReferenceName),
  ]);

  for (const reference of referenceQueue) {
    let { link, name } = reference;

    QScrapePrompts.context.output.write(
      `> A reference has been polled: ${reference}` + EOL,
    );
    const doScrape = await QScrapePrompts.confirmation(
      'Do you want to scrape this reference?',
    )();
    if (!doScrape) {
      continue;
    }

    const response = await fetch(link, { redirect: 'follow' });
    if (!response.ok) {
      const { status, statusText } = response;
      QScrapePrompts.context.output.write(
        `> The reference is not available: HTTP ${status} ${statusText}` + EOL,
      );
      continue;
    }

    let content: string | undefined;
    const references: Reference[] = [];
    const mediaType = /^([A-Za-z]*\/[+-._\w]*)/
      .exec(response.headers.get('content-type') ?? '')?.[1]
      ?.toLowerCase();
    switch (mediaType) {
      case 'text/html':
      case 'application/xhtml+xml':
        const { document } = new JSDOM(await response.text(), {
          url: link,
        }).window;
        content = document.body.textContent ?? '';
        name = document.title;
        references.push(...Reference.fromHtml(document));
        break;
      case 'text/plain':
        content = await response.text();
        break;
      default:
        QScrapePrompts.context.output.write(
          `> The reference media type is not available: ${mediaType}` + EOL,
        );
        continue;
    }
    references.push(...Reference.fromText(content));

    QScrapePrompts.context.output.write(
      `> The reference media type is "${mediaType}"` +
        EOL +
        `> The reference has ${references.length} references:` +
        EOL +
        references.map((ref) => `    - ${ref}`).join(EOL) +
        EOL,
    );
    const doCheckContent = await QScrapePrompts.confirmation(
      'Do you want to check the reference content?',
      false,
    )();
    if (doCheckContent) {
      edit(content, {
        mode: 0o444,
        prefix: 'qscrape',
        postfix: `.${mediaTypeToFileExtension[mediaType]}`,
      });
    }

    const doSaveAndExplore = await QScrapePrompts.confirmation(
      'Do you want to save the reference and explore its references?',
    )();
    if (doSaveAndExplore) {
      QScrapeMain.result.push(new Reference(link, name));
      referenceQueue.push(...references);
    }
  }
}

export namespace QScrapeMain {
  /**
   * ## Introduction
   * The result type of `QScrapeMain`
   *
   * ## Layout
   * - `Reference[]`
   *   + The scraped references
   */
  export type Result = Reference[];

  /**
   * ## Introduction
   * The result of `QScrapeMain`
   *
   * ## Layout
   * - `Result`
   *   + The scraped references
   */
  export const result: Result = [];
}
