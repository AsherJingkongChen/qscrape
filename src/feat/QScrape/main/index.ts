import { Resource, Queue } from '../../../core';
import { context } from '../context';
import { getInitialLink } from './getInitialLink';
import { getSuccessfulResponse } from './getSuccessfulResponse';
import { getParsedResponse } from './getParsedResponse';
import { EOL } from 'os';
import { edit } from 'external-editor';
import confirm from '@inquirer/confirm';
import select from '@inquirer/select';

/**
 * `QScrape.main`
 */
export async function main(): Promise<void> {
  context.streams.output.write(`Q-Scrape: Explore the Web${EOL}`);
  const resourceQueue = new Queue([new Resource(await getInitialLink())]);
  for (const resource of resourceQueue) {
    const doScrape = await confirm(
      {
        default: true,
        message: `${resource}${EOL}  Do you want to scrape this resource?`,
      },
      context.streams,
    );
    if (!doScrape) {
      continue;
    }
    const response = await getSuccessfulResponse(resource.link);
    if (!response) {
      continue;
    }
    const parsedResponse = await getParsedResponse(response);
    if (!parsedResponse) {
      continue;
    }
    const { documentTitle, textContent, relatedResources } = parsedResponse;
    const doCheckContent = await confirm(
      {
        default: false,
        message: 'Do you want to check the content?',
      },
      context.streams,
    );
    if (doCheckContent) {
      edit(textContent, {
        mode: 0o444,
        prefix: 'QScrape',
        postfix: `.txt`,
      });
    }
    let resourceName = resource.name;
    if (documentTitle) {
      resourceName = await select(
        {
          choices: [
            {
              name: resourceName,
              value: resourceName,
            },
            {
              name: documentTitle,
              value: documentTitle,
            },
          ],
          default: 'Current',
          message: 'Select the resource name:',
        },
        context.streams,
      );
    }
    const doSave = await confirm(
      {
        message: 'Do you want to save the resource?',
      },
      context.streams,
    );
    if (doSave) {
      context.result.push(new Resource(resource.link, resourceName));
    }
    const doContinue = await confirm(
      {
        message: 'Do you want to continue?',
      },
      context.streams,
    );
    if (!doContinue) {
      break;
    }
    resourceQueue.push(...relatedResources);
  }
}
