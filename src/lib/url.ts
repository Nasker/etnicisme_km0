/**
 * Build a root-relative URL that respects the configured Astro `base` path.
 * Use this for all internal links and asset references.
 */
const rawBase = import.meta.env.BASE_URL;
export const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export function url(path: string): string {
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  return base + trimmed;
}
