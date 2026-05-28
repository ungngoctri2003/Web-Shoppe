import { Drawer, Dropdown } from 'antd';
import { memo, useState, type ReactNode } from 'react';
import { BiLogIn, BiLogOut, BiMenu, BiUser } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import {
  STORE_AUTH_LINKS,
  STORE_NAV_LINKS,
  STORE_USER_DRAWER_LINKS,
} from '../../constants/storeHeaderNav';
import { getCartState } from '../../features/slices/cart.slice';
import { resetLogin } from '../../features/slices/app.slice';
import { InfoUserState, resetUserState } from '../../features/slices/user.slice';
import '../../css/components/Header.css';
import StoreHeaderNav from './StoreHeaderNav';
import StoreNavLinkContent from './StoreNavLinkContent';

function StoreHeaderShell({ children }: { children: ReactNode }) {
  return (
    <header className="store-header" role="banner">
      <div className="store-header__container">
        <div className="store-header__body">{children}</div>
      </div>
    </header>
  );
}

function StoreHeader() {
  const user = useSelector(InfoUserState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalCartItem } = useSelector(getCartState);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    dispatch(resetUserState());
    dispatch(resetLogin());
    navigate('/auth/login');
  };

  const userMenu = user?.id
    ? [
        { key: '1', label: 'Trang cá nhân', onClick: () => navigate('/user/profile') },
        { key: '2', label: 'Đơn mua', onClick: () => navigate('/user/orderstatus') },
        { key: '3', label: 'Đăng xuất', onClick: handleLogout },
      ]
    : [{ key: '1', label: 'Đăng nhập', onClick: () => navigate('/auth/login') }];

  const closeDrawer = () => setDrawerOpen(false);

  const navTo = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  const drawerLinks = [
    ...STORE_NAV_LINKS,
    ...(!user?.id ? STORE_AUTH_LINKS : STORE_USER_DRAWER_LINKS),
  ];

  const navProps = {
    isLoggedIn: !!user?.id,
    cartCount: totalCartItem,
  };

  const loginLink = STORE_AUTH_LINKS[0];
  const LoginIcon = loginLink.icon;

  return (
    <StoreHeaderShell>
      <div className="store-header__toolbar">
        <button
          type="button"
          className="store-header__icon-btn store-header__menu-btn"
          aria-label="Mở menu"
          aria-expanded={drawerOpen}
          aria-controls="store-header-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <BiMenu aria-hidden />
        </button>

        <Link to="/user" className="store-header__brand" aria-label="Trang chủ">
          <img src={logo} className="store-header__logo" alt="T2 SHOP" />
        </Link>

        <div className="store-header__center">
          <StoreHeaderNav className="store-header__nav store-header__nav--desktop" {...navProps} />
        </div>

        <div className="store-header__actions">
          {user?.id ? (
            <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
              <button
                type="button"
                className="store-header__user-btn"
                aria-label={`Tài khoản: ${user?.fullName || 'Người dùng'}`}
              >
                <span className="store-header__user-avatar" aria-hidden>
                  <BiUser />
                </span>
                <span className="store-header__user-name">{user?.fullName || 'Tài khoản'}</span>
              </button>
            </Dropdown>
          ) : (
            <Link to="/auth/login" className="store-header__login-btn store-header__login-btn--toolbar">
              <LoginIcon className="store-header__login-btn-icon" aria-hidden />
              <span>{loginLink.label}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="store-header__mobile-nav">
        <StoreHeaderNav
          className="store-header__nav store-header__nav--mobile"
          showAuthLinks={false}
          {...navProps}
        />
      </div>

      <Drawer
        id="store-header-drawer"
        title={
          <Link to="/user" className="store-header__drawer-brand" onClick={closeDrawer}>
            <img src={logo} alt="T2 SHOP" className="store-header__drawer-logo" />
          </Link>
        }
        placement="left"
        onClose={closeDrawer}
        open={drawerOpen}
        width={300}
        className="store-header__drawer"
        styles={{ body: { padding: 0 } }}
      >
        {user?.id && (
          <div className="store-header__drawer-user">
            <span className="store-header__drawer-user-avatar" aria-hidden>
              <BiUser />
            </span>
            <div className="store-header__drawer-user-info">
              <span className="store-header__drawer-user-greeting">Xin chào</span>
              <span className="store-header__drawer-user-name">{user.fullName || 'Khách hàng'}</span>
            </div>
          </div>
        )}

        <nav className="store-header__drawer-links" aria-label="Menu di động">
          {drawerLinks.map((link) => (
            <button key={link.to} type="button" onClick={() => navTo(link.to)}>
              <StoreNavLinkContent link={link} cartCount={totalCartItem} />
            </button>
          ))}

          {user?.id && (
            <button
              type="button"
              className="store-header__drawer-logout"
              onClick={() => {
                handleLogout();
                closeDrawer();
              }}
            >
              <span className="store-header__drawer-logout-inner">
                <span className="store-header__nav-icon store-header__nav-icon--danger" aria-hidden>
                  <BiLogOut />
                </span>
                <span>Đăng xuất</span>
              </span>
            </button>
          )}
        </nav>
      </Drawer>
    </StoreHeaderShell>
  );
}

export default memo(StoreHeader);
