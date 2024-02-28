import { Resource } from '../../../../core';
import { context } from '../../context';
import { prompt } from '../../prompt';
import { JSDOM } from 'jsdom';
import { state } from './state';
import { getPrettyLinkName } from './getPrettyLinkName';
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
  switch (mediaType) {
    case 'text/html':
    case 'application/xhtml+xml':
      const { document } = new JSDOM(rawTextContent, {
        contentType: mediaType,
        url: response.url,
      }).window;
      state.altName = document.title;
      state.relatedResources.push(...Resource.fromHtml(document));
      state.textContent = document.body.textContent ?? '';
      break;
    case 'text/plain':
      state.altName = getPrettyLinkName(state.link);
      state.textContent = rawTextContent;
      break;
    default:
      return complain(`Unsupported media type "${mediaType}"`, { spinner });
  }
  state.relatedResources.push(...Resource.fromText(state.textContent));

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
