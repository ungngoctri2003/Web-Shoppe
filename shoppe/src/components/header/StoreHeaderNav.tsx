import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { StoreNavLink } from '../../constants/storeHeaderNav';
import { STORE_AUTH_LINKS, STORE_NAV_LINKS } from '../../constants/storeHeaderNav';
import StoreNavLinkContent from './StoreNavLinkContent';
import { findActiveStoreNavLink, isStoreNavLinkActive } from './storeNavActive';

type NavIndicator = {
  left: number;
  width: number;
  ready: boolean;
};

function NavItem({
  link,
  cartCount,
  onLinkRef,
}: {
  link: StoreNavLink;
  cartCount: number;
  onLinkRef: (to: string, el: HTMLAnchorElement | null) => void;
}) {
  const { pathname } = useLocation();
  const active = isStoreNavLinkActive(pathname, link);

  return (
    <NavLink
      to={link.to}
      end={link.end ?? false}
      ref={(el) => onLinkRef(link.to, el)}
      className={[
        'store-header__nav-link',
        active ? 'store-header__nav-link--active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <StoreNavLinkContent link={link} cartCount={cartCount} />
    </NavLink>
  );
}

type StoreHeaderNavProps = {
  className: string;
  isLoggedIn: boolean;
  cartCount: number;
  /** Ẩn link đăng nhập (dùng khi toolbar đã có nút đăng nhập trên mobile) */
  showAuthLinks?: boolean;
};

export default function StoreHeaderNav({
  className,
  isLoggedIn,
  cartCount,
  showAuthLinks = true,
}: StoreHeaderNavProps) {
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState<NavIndicator>({ left: 0, width: 0, ready: false });

  const links = useMemo(() => {
    const items = [...STORE_NAV_LINKS];
    if (showAuthLinks && !isLoggedIn) {
      items.push(...STORE_AUTH_LINKS);
    }
    return items;
  }, [showAuthLinks, isLoggedIn]);

  const activeLink = useMemo(
    () => findActiveStoreNavLink(pathname, links),
    [pathname, links],
  );

  const setLinkRef = useCallback((to: string, el: HTMLAnchorElement | null) => {
    if (el) {
      linkRefs.current.set(to, el);
    } else {
      linkRefs.current.delete(to);
    }
  }, []);

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    const activeEl = activeLink ? linkRefs.current.get(activeLink.to) : undefined;

    if (!nav || !activeEl) {
      setIndicator((prev) => ({ ...prev, ready: false }));
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeEl.getBoundingClientRect();

    setIndicator({
      left: linkRect.left - navRect.left + nav.scrollLeft,
      width: linkRect.width,
      ready: true,
    });
  }, [activeLink]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, pathname, cartCount, links.length]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const activeEl = activeLink ? linkRefs.current.get(activeLink.to) : undefined;
    activeEl?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

    const resizeObserver = new ResizeObserver(() => updateIndicator());
    resizeObserver.observe(nav);
    linkRefs.current.forEach((el) => resizeObserver.observe(el));

    window.addEventListener('resize', updateIndicator);
    nav.addEventListener('scroll', updateIndicator, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateIndicator);
      nav.removeEventListener('scroll', updateIndicator);
    };
  }, [updateIndicator, activeLink]);

  return (
    <nav
      ref={navRef}
      className={[className, 'store-header__nav--animated'].filter(Boolean).join(' ')}
      aria-label="Điều hướng chính"
    >
      <span
        className="store-header__nav-indicator"
        aria-hidden
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
          opacity: indicator.ready ? 1 : 0,
        }}
      />
      {links.map((link) => (
        <NavItem key={link.to} link={link} cartCount={cartCount} onLinkRef={setLinkRef} />
      ))}
    </nav>
  );
}
