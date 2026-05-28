import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveBannerTarget } from '../../../untils/bannerLink';

interface BannerClickableProps {
  linkTo?: string | null;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * Banner click handler — uses router navigate (no full page reload).
 * Ignores "/" and "/user" placeholders from admin/seed data.
 */
export default function BannerClickable({
  linkTo,
  className,
  ariaLabel,
  children,
}: BannerClickableProps) {
  const navigate = useNavigate();
  const target = resolveBannerTarget(linkTo ?? undefined);

  if (!target) {
    return <div className={className}>{children}</div>;
  }

  if (target.type === 'external') {
    return (
      <a
        href={target.url}
        className={className}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  const go = () => navigate(target.path);

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    go();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go();
    }
  };

  return (
    <div
      className={className}
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
