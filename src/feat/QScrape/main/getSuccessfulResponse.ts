import { context } from '../context';
import { EOL } from 'os';

/**
 * ## Introduction
 * Gets a successful response from a link
 * 
 * ## Parameters
 * - `link`: `string`
 *   + A resource link
 * 
 * ## Returns
 * - `Promise<Response | undefined>`
 *   + Resolves to a successful response
 *   + It is `undefined` if the resource is not available
 */
export async function getSuccessfulResponse(
  link: string,
): Promise<Response | undefined> {
  let response: Response | undefined;
  try {
    response = await fetch(link, { redirect: 'follow' });
  } catch (error) {
    complain(error instanceof Error ? error.message : `${error}`);
    return;
  }
  if (!response.ok) {
    const { status, statusText } = response;
    complain(`HTTP ${status} ${statusText}`);
    return;
  }
  return response;
}

function complain(reason: string): void {
  context.streams.output.write(
    `! The resource is not available: ${reason}${EOL}`,
  );
}
