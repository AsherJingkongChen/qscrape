import { Resource } from '../../../core';
import { context } from '../context';
import { JSDOM } from 'jsdom';
import { EOL } from 'os';

/**
 * ## Introduction
 * The result type of `getParsedResponse`
 * 
 * ## Layout
 * - `Object`
 *   - `documentTitle`: `string | undefined`
 *     + The title of the document if it is an HTML document
 *   - `relatedResources`: `Resource[]`
 *     + All related resources found in the content
 *   - `textContent`: `string`
 *     + The text content of the document
 */
export type ParsedResponse = {
  documentTitle?: string;
  relatedResources: Resource[];
  textContent: string;
};

/**
 * ## Introduction
 * Parses a successful response
 * 
 * ## Parameters
 * - `response`: `Response`
 *   + A successful response
 * 
 * ## Returns
 * - `Promise<ParsedResponse | undefined>`
 *   + The result of parsing a response
 *   + It is `undefined` if the media type is not available
 */
export async function getParsedResponse(
  response: Response,
): Promise<ParsedResponse | undefined> {
  const result: ParsedResponse = {
    relatedResources: [],
    textContent: '',
  };
  const mediaType = /^([A-Za-z]*\/[+-._\w]*)/
    .exec(response.headers.get('content-type') ?? '')?.[1]
    ?.toLowerCase();
  switch (mediaType) {
    case 'text/html':
    case 'application/xhtml+xml':
      const { document } = new JSDOM(await response.text(), {
        contentType: mediaType,
        url: response.url,
      }).window;
      result.documentTitle = document.title;
      result.relatedResources.push(...Resource.fromHtml(document));
      result.textContent = document.body.textContent ?? '';
      break;
    case 'text/plain':
      result.textContent = await response.text();
      break;
    default:
      context.streams.output.write(
        `! The resource media type is not available: ${mediaType}${EOL}`,
      );
      return;
  }
  result.relatedResources.push(...Resource.fromText(result.textContent));
  return result;
}
