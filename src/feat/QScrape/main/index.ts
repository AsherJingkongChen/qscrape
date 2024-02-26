import type { QScrape } from '..';
import { Resource, Queue } from '../../../core';
import { context } from '../context';
import { getInitialLink } from './getInitialLink';
import { getSuccessfulResponse } from './getSuccessfulResponse';
import { getParsedResponse } from './getParsedResponse';
import { getPrettyLinkName } from './getPrettyLinkName';
import { EOL } from 'os';
import { edit } from 'external-editor';
import select from '@inquirer/select';

export const main: QScrape['main'] = async function main() {
  // Shows the program heading
  context.streams.output.write(`Q-Scrape: Explore the Web${EOL}`);

  // Creates a queue of resources to scrape
  const resourcesToScrape = new Queue([new Resource(await getInitialLink())]);
  for (let { link, name } of resourcesToScrape) {
    // Confirms if the user wants to scrape the resource
    const doScrape = await select(
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
        message: `Do you want to scrape "${link}"?`,
      },
      context.streams,
    );
    if (!doScrape) {
      continue;
    }

    // Fetches the resource
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
      context.result.push(new Resource(link, name));
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
    if (doContinue) {
      if (doSave) {
        // Pushes the related resources to the queue
        resourcesToScrape.push(...relatedResources);
      }
      continue;
    }
    break;
  }
};
