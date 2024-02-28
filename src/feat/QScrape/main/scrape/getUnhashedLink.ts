/**
 * ## Introduction
 * Remove the hash from a link
 *
 * ## Parameters
 * - `link`: `string`
 *   + The link with or without hash
 *
 * ## Returns
 * - `string`
 *   + A link without hash
 */
export function getUnhashedLink(link: string): string {
  const url = new URL(link);
  url.hash = '';
  return url.href;
}
