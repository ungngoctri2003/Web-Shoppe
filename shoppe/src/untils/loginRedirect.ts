import type { Location, NavigateFunction } from 'react-router-dom';

const STORAGE_KEY = 't2shop_login_redirect';

export function setLoginRedirect(path: string) {
  if (path.startsWith('/')) {
    sessionStorage.setItem(STORAGE_KEY, path);
  }
}

export function clearLoginRedirect() {
  sessionStorage.removeItem(STORAGE_KEY);
}

/** Đường dẫn sau đăng nhập: state → query returnUrl → sessionStorage → mặc định */
export function resolveLoginRedirect(
  location: Location,
  fallback = '/user'
): string {
  const fromState = (location.state as { from?: unknown } | null)?.from;

  if (typeof fromState === 'string' && fromState.startsWith('/')) {
    return fromState;
  }

  if (fromState && typeof fromState === 'object' && 'pathname' in fromState) {
    const loc = fromState as { pathname: string; search?: string };
    if (loc.pathname.startsWith('/')) {
      return loc.pathname + (loc.search ?? '');
    }
  }

  const returnUrl = new URLSearchParams(location.search).get('returnUrl');
  if (returnUrl?.startsWith('/')) {
    return returnUrl;
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored?.startsWith('/')) {
    return stored;
  }

  return fallback;
}

export function goToLogin(navigate: NavigateFunction, returnPath: string) {
  setLoginRedirect(returnPath);
  const search = `?returnUrl=${encodeURIComponent(returnPath)}`;
  navigate(`/auth/login${search}`, { state: { from: returnPath } });
}
