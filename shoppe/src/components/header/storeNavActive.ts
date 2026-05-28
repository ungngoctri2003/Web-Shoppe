import type { StoreNavLink } from '../../constants/storeHeaderNav';

export function isStoreNavLinkActive(pathname: string, link: StoreNavLink): boolean {
  if (link.matchPrefix) {
    return pathname === link.matchPrefix || pathname.startsWith(`${link.matchPrefix}/`);
  }
  if (link.end) {
    return pathname === link.to;
  }
  return pathname === link.to || pathname.startsWith(`${link.to}/`);
}

export function findActiveStoreNavLink(
  pathname: string,
  links: StoreNavLink[],
): StoreNavLink | undefined {
  return links.find((link) => isStoreNavLinkActive(pathname, link));
}
