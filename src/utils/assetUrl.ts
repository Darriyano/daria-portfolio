/** Resolve public assets for both a Pages project path and root-domain hosting. */
export function assetUrl(path: string): string {
  return path.startsWith('/') && !path.startsWith('//')
    ? import.meta.env.BASE_URL + path.slice(1)
    : path
}
