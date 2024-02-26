/**
 * ## Introduction
 * Get a pretty name for a resource link
 *
 * ## Parameters
 * - `link`: `string`
 *   + A resource link
 *
 * ## Returns
 * - `string`
 *   + A resource name crafted with the components of link
 */
export function getPrettyLinkName(link: string): string {
  const { host, pathname } = new URL(link);
  const breadcrumb = pathname
    .split('/')
    .map((p) => (p[0]?.toLowerCase() ?? '') + p.slice(1))
    .reverse()
    .join(' ')
    .trim()
    .replaceAll(' ', ' - ');
  const cleanPrefix = decodeURIComponent(breadcrumb)
    .slice(0, 60)
    .replace(/\s+-?\s?$/, '');
  const prefixEllipsis = cleanPrefix.length < 60 ? '' : ' ...';
  const splitter = cleanPrefix ? ' - ' : '';
  return cleanPrefix + prefixEllipsis + splitter + host;
}
