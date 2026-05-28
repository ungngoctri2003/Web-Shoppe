import type { StoreNavLink } from '../../constants/storeHeaderNav';

type StoreNavLinkContentProps = {
  link: StoreNavLink;
  cartCount?: number;
  className?: string;
};

export default function StoreNavLinkContent({
  link,
  cartCount = 0,
  className = '',
}: StoreNavLinkContentProps) {
  const Icon = link.icon;
  const showCartBadge = link.to === '/user/cart' && cartCount > 0;

  return (
    <span className={['store-header__nav-link-inner', className].filter(Boolean).join(' ')}>
      <span className="store-header__nav-icon" aria-hidden>
        <Icon />
      </span>
      <span className="store-header__nav-link-text">{link.label}</span>
      {showCartBadge && (
        <span className="store-header__nav-badge" aria-label={`${cartCount} sản phẩm`}>
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </span>
  );
}
