import type { QScrape } from '..';
import { Resource, Queue } from '../../../core';
import { context } from '../context';
import { inquireLink } from './inquireLink';
import { getSuccessfulResponse } from './getSuccessfulResponse';
import { getParsedResponse } from './getParsedResponse';
import { getPrettyLinkName } from './getPrettyLinkName';
import { EOL } from 'os';
import { edit } from 'external-editor';
import select from '@inquirer/select';

export const main: QScrape['main'] = async function main() {
  // Shows the program heading
  context.streams.output.write(`> Q-Scrape: Explore the Web${EOL}`);
  while (await runUserSession());
};

/**
 * ## Introduction
 * Starts a session of `QScrape.main` and runs it
 * 
 * ## Returns
 * - `Promise<boolean>`
 *   + `true` if the user wants to continue, otherwise `false`
 */
async function runUserSession(): Promise<boolean> {
  // Creates a queue of resources to scrape
  const resourcesToScrape = new Queue([new Resource(await inquireLink())]);
  for (let { link, name } of resourcesToScrape) {
    // Fetches the resource
    context.streams.output.write(`> Fetching "${link}" ...${EOL}`);
    const response = await getSuccessfulResponse(link);
    if (!response) {
      continue;
    }

    // Parses the response
    const parsedResponse = await getParsedResponse(response);
    if (!parsedResponse) {
      continue;
    }
    const { documentTitle, textContent, relatedResources } = parsedResponse;

    // Confirms if the user wants to check the content
    const doCheckContent = await select(
      {
        choices: [
          {
            name: 'Yes',
            value: true,
          },
          {
            name: 'No',
            value: false,
          },
        ],
        default: false,
        message: 'Do you want to check the content?',
      },
      context.streams,
    );
    if (doCheckContent) {
      // Shows the content in an external read-only editor
      edit(textContent, {
        mode: 0o444,
        prefix: 'QScrape-',
        postfix: `.txt`,
      });
    }

    // Confirms if the user wants to rename the resource
    const originalName = name;
    const prettyName = getPrettyLinkName(link);
    const renameOptions = {
      choices: [{ name, value: originalName }],
      default: prettyName,
      message: 'Select the resource name:',
    };
    if (prettyName !== originalName) {
      renameOptions.choices.unshift({ name: prettyName, value: prettyName });
    }
    if (documentTitle) {
      renameOptions.choices.unshift({
        name: documentTitle,
        value: documentTitle,
      });
      renameOptions.default = documentTitle;
    }
    name = await select(renameOptions, context.streams);

    // Confirms if the user wants to save the resource
    const doSave = await select(
      {
        choices: [
          {
            name: 'Yes',
            value: true,
          },
          {
            name: 'No',
            value: false,
          },
        ],
        default: true,
        message: 'Do you want to save this resource?',
      },
      context.streams,
    );
    if (doSave) {
      // Saves the resource and pushes the related resources
      context.result.push(new Resource(link, name));
      resourcesToScrape.push(...relatedResources);
    }

    // Confirms if the user wants to continue to explore
    const doContinue = await select(
      {
        choices: [
          {
            name: 'Yes',
            value: true,
          },
          {
            name: 'No',
            value: false,
          },
        ],
        default: true,
        message: `There are ${context.result.length} saved resources. Do you want to continue?`,
      },
      context.streams,
    );
    if (!doContinue) {
      return false;
    }
  }
  return true;
}
