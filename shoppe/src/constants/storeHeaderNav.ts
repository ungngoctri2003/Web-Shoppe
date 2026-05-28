import type { IconType } from 'react-icons';
import {
  BiCart,
  BiHomeAlt,
  BiInfoCircle,
  BiLogIn,
  BiReceipt,
  BiStore,
  BiUser,
} from 'react-icons/bi';

export type StoreNavLink = {
  to: string;
  label: string;
  icon: IconType;
  end?: boolean;
  /** Kích hoạt khi pathname bắt đầu bằng chuỗi này (vd. /user/products/:id) */
  matchPrefix?: string;
};

export const STORE_NAV_LINKS: StoreNavLink[] = [
  { to: '/user', label: 'Trang chủ', icon: BiHomeAlt, end: true },
  { to: '/user/products', label: 'Sản phẩm', icon: BiStore, matchPrefix: '/user/products' },
  { to: '/user/about', label: 'Giới thiệu', icon: BiInfoCircle },
  { to: '/user/cart', label: 'Giỏ hàng', icon: BiCart, matchPrefix: '/user/cart' },
];

export const STORE_AUTH_LINKS: StoreNavLink[] = [
  { to: '/auth/login', label: 'Đăng nhập', icon: BiLogIn, end: true },
];

export const STORE_USER_DRAWER_LINKS: StoreNavLink[] = [
  { to: '/user/profile', label: 'Trang cá nhân', icon: BiUser },
  { to: '/user/orderstatus', label: 'Đơn mua', icon: BiReceipt },
];
