import { Queue, QuietError, Resource } from '../../../../core';
import { inquireToContinue } from './inquireToContinue';
import { inquireToRename } from './inquireToRename';
import { inquireToSave } from './inquireToSave';
import { inquireToViewContent } from './inquireToViewContent';
import { parseResource } from './parseResource';
import { state } from './state';

/**
 * ## Introduction
 * Polls a resource from a queue and scrapes it
 *
 * ## Parameters
 * - `resources`: `Queue<Resource>`
 *   + A queue of resources
 *
 * ## Returns
 * - `Promise<boolean>`
 *   + Rejects with a special error if the user wants to stop
 *   + Resolves to
 *     - `false` if `resources` has been drained
 *     - `true` if the user wants to continue on the next resource
 */
export async function scrape(resources: Queue<Resource>): Promise<boolean> {
  // Polls a resource
  const resource = resources.poll();
  if (!resource) {
    return false;
  }

  // Assigns the state
  state.reset();
  state.link = resource.link;
  state.name = resource.name;

  // Parses the resource
  if (!(await parseResource())) {
    return true;
  }

  // Views the content
  await inquireToViewContent();

  // Saves the resource
  if (await inquireToSave()) {
    // Names the resource
    await inquireToRename();

    // Pushes the related resources into the queue
    resources.push(...state.relatedResources);
  }

  // Continues or stops
  if (await inquireToContinue()) {
    return true;
  } else {
    // Stops if the user does not want to continue
    throw new QuietError();
  }
}
