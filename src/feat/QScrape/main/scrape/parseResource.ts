import { Resource } from '../../../../core';
import { context } from '../../context';
import { prompt } from '../../prompt';
import { JSDOM } from 'jsdom';
import { state } from './state';
import { getPrettyLinkName } from './getPrettyLinkName';
import { getUnhashedLink } from './getUnhashedLink';
import cl from 'chalk';
import ora, { Ora, spinners } from 'ora';
import { EOL } from 'os';

/**
 * ## Introduction
 * Fetches the resource and parses its response
 *
 * ## Returns
 * - `Promise<boolean>`
 *   + Resolves to `true` if succeeds, otherwise `false`.
 *
 * ## Note
 * - It depends on `state`
 */
export async function parseResource(): Promise<boolean> {
  const spinner = ora({
    color: 'yellow',
    discardStdin: false,
    hideCursor: false,
    prefixText: prompt`Fetching ${cl.cyan(state.link)}`,
    spinner: spinners.line,
    stream: context.streams.output,
  }).start();

  // Fetches the resource
  let response: Response | undefined;
  try {
    response = await fetch(state.link, { redirect: 'follow' });
  } catch (error) {
    return complain(error instanceof Error ? error.message : `${error}`, {
      spinner,
    });
  }
  if (!response.ok) {
    const { status, statusText } = response;
    return complain(`HTTP ${status} ${statusText}`, { spinner });
  }

  // Reads the response
  let rawTextContent: string | undefined;
  try {
    rawTextContent = await response.text();
  } catch (error) {
    return complain(error instanceof Error ? error.message : `${error}`, {
      spinner,
    });
  }

  // Parses the response
  const mediaType = (response.headers.get('content-type') ?? '')
    .split(';')[0]
    ?.toLowerCase();
  const unhashedLink = getUnhashedLink(state.link);
  switch (mediaType) {
    case 'text/html':
    case 'application/xhtml+xml':
      const { document } = new JSDOM(rawTextContent, {
        contentType: mediaType,
        url: response.url,
      }).window;
      state.altName = document.title;
      state.textContent = document.body.textContent ?? '';
      let findLimit = 50;
      for (const foundResource of Resource.fromHtml(document)) {
        // Exclude found resources with the same unhashed link
        if (getUnhashedLink(foundResource.link) !== unhashedLink) {
          if (--findLimit <= 0) {
            break;
          }
          state.relatedResources.push(foundResource);
        }
      }
      document.documentElement.remove();
      break;
    case 'text/plain':
      state.altName = getPrettyLinkName(state.link);
      state.textContent = rawTextContent;
      break;
    default:
      return complain(`Unsupported media type "${mediaType}"`, { spinner });
  }

  // Exclude the found resources with the same unhashed link
  let findLimit = 50;
  for (const foundResource of Resource.fromText(state.textContent)) {
    if (getUnhashedLink(foundResource.link) !== unhashedLink) {
      if (--findLimit <= 0) {
        break;
      }
      state.relatedResources.push(foundResource);
    }
  }

  // Succeeds with `true`
  spinner.stopAndPersist({ symbol: '' });
  return true;
}

/**
 * ## Introduction
 * Shows a complaint due to some errors
 *
 * ## Parameters
 * - `reason`: `string`
 *   + The reason of the complaint
 *
 * ## Returns
 * - `false`
 *   + A failure
 */
function complain(reason: string, state: { spinner: Ora }): false {
  state.spinner.stopAndPersist({ symbol: '' });
  context.streams.output.write(
    prompt`${cl.yellow(`The resource is not available: ${reason}`)}${EOL}`,
  );
  return false;
}
