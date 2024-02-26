import { Resource } from '../../../core';
import { context } from '../context';
import { JSDOM } from 'jsdom';
import { EOL } from 'os';

export type ParsedResponse = {
  documentTitle?: string;
  relatedResources: Resource[];
  textContent: string;
};

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
