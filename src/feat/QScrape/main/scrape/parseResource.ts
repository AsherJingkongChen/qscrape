import { Resource } from '../../../../core';
import { context } from '../../context';
import { prompt } from '../../prompt';
import { JSDOM } from 'jsdom';
import { state } from './state';
import { getPrettyLinkName } from './getPrettyLinkName';
import cl from 'chalk';
// import ora from 'ora';

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
  // const spinner = ora({
  //   color: 'yellow',
  //   hideCursor: false,
  //   stream: context.streams.output,
  //   prefixText: ``,
  // }).start();
  context.streams.output.write(prompt`Fetching ${cl.cyan(state.link)} ...`);

  // Fetches the resource
  let response: Response | undefined;
  try {
    response = await fetch(state.link, { redirect: 'follow' });
  } catch (error) {
    return complain(error instanceof Error ? error.message : `${error}`);
  } finally {
    // spinner.stop();
  }
  if (!response.ok) {
    const { status, statusText } = response;
    return complain(`HTTP ${status} ${statusText}`);
  }

  // Reads the response
  const mediaType = (response.headers.get('content-type') ?? '')
    .split(';')[0]
    ?.toLowerCase();
  switch (mediaType) {
    case 'text/html':
    case 'application/xhtml+xml':
      const { document } = new JSDOM(await response.text(), {
        contentType: mediaType,
        url: response.url,
      }).window;
      state.altName = document.title;
      state.relatedResources.push(...Resource.fromHtml(document));
      state.textContent = document.body.textContent ?? '';
      break;
    case 'text/plain':
      state.altName = getPrettyLinkName(state.link);
      state.textContent = await response.text();
      break;
    default:
      return complain(`Unsupported media type "${mediaType}"`);
  }
  state.relatedResources.push(...Resource.fromText(state.textContent));

  // Succeeds with `true`
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
function complain(reason: string): false {
  context.streams.output.write(
    prompt`${cl.yellow(`The resource is not available: ${reason}`)}`,
  );
  return false;
}
