/** Read link from API (camelCase or PascalCase). */
export function getBannerLinkValue(banner: {
  linkTo?: string | null;
  LinkTo?: string | null;
}): string | undefined {
  const raw = banner.linkTo ?? banner.LinkTo;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

export function isInternalBannerLink(link: string): boolean {
  const trimmed = link.trim();
  if (!trimmed) return false;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).origin === window.location.origin;
    } catch {
      return false;
    }
  }

  return trimmed.startsWith('/') || !trimmed.includes('://');
}

export function toBannerRouterPath(link: string): string {
  const trimmed = link.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return trimmed;
    }
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** Links that only point at home — clicking would feel like a useless reload. */
export function isNoOpBannerLink(link: string | undefined): boolean {
  if (!link) return true;

  const path = toBannerRouterPath(link).replace(/\/+$/, '') || '/';
  return path === '/' || path === '/user';
}

export function resolveBannerTarget(
  link: string | undefined
): { type: 'internal'; path: string } | { type: 'external'; url: string } | null {
  if (!link || isNoOpBannerLink(link)) return null;

  if (isInternalBannerLink(link)) {
    const path = toBannerRouterPath(link);
    if (isNoOpBannerLink(path)) return null;
    return { type: 'internal', path };
  }

  return { type: 'external', url: link };
}
