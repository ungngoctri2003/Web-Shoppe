import { Badge, Drawer, Dropdown } from 'antd';
import { memo, useCallback, useState } from 'react';
import { BiCart, BiMenu } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo_home.png';
import { getCartState } from '../features/slices/cart.slice';
import { resetLogin } from '../features/slices/app.slice';
import { InfoUserState, resetUserState } from '../features/slices/user.slice';
import '../css/components/Header.css';
import CartMenuHeader from './CartMenuHeader';
import ShopeeSearch from './ShopeeSearch';

function Header() {
  const user = useSelector(InfoUserState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: cartItems, totalCartItem } = useSelector(getCartState);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    dispatch(resetUserState());
    dispatch(resetLogin());
    navigate('/auth/login');
  };

  const handleCartPage = () => navigate('/user/cart');

  const cartMenuComponent = useCallback(
    () => (
      <CartMenuHeader
        cartItems={cartItems}
        totalCartItem={totalCartItem}
        handleCartPage={handleCartPage}
      />
    ),
    [cartItems, totalCartItem]
  );

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

  return (
    <header className="store-header" role="banner">
      <div className="store-header__container">
        <div className="store-header__top">
          <nav className="store-header__top-links" aria-label="Liên kết hỗ trợ">
            <button type="button" className="store-header__top-link">
              Kênh người bán
            </button>
            <span className="store-header__top-divider" aria-hidden />
            <button type="button" className="store-header__top-link">
              Trở thành người bán
            </button>
            <span className="store-header__top-divider" aria-hidden />
            <button type="button" className="store-header__top-link">
              Tải ứng dụng
            </button>
          </nav>
          <div className="store-header__top-actions">
            {!user?.id ? (
              <>
                <button
                  type="button"
                  className="store-header__top-link"
                  onClick={() => navigate('/auth/register')}
                >
                  Đăng ký
                </button>
                <span className="store-header__top-divider" aria-hidden />
                <button
                  type="button"
                  className="store-header__top-link store-header__top-link--strong"
                  onClick={() => navigate('/auth/login')}
                >
                  Đăng nhập
                </button>
              </>
            ) : (
              <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                <button type="button" className="store-header__top-link store-header__top-link--strong">
                  {user?.fullName || 'Tài khoản'}
                </button>
              </Dropdown>
            )}
          </div>
        </div>

        <div className="store-header__body">
          <div className="store-header__toolbar">
            <button
              type="button"
              className="store-header__icon-btn store-header__menu-btn"
              aria-label="Mở menu"
              onClick={() => setDrawerOpen(true)}
            >
              <BiMenu aria-hidden />
            </button>

            <Link to="/user" className="store-header__brand" aria-label="Trang chủ">
              <span className="store-header__logo-wrap">
                <img src={logo} className="store-header__logo" alt="" />
              </span>
            </Link>

            <div className="store-header__search store-header__search--desktop">
              <ShopeeSearch />
            </div>

            <div className="store-header__actions">
              {!user?.id && (
                <button
                  type="button"
                  className="store-header__auth-mobile"
                  onClick={() => navigate('/auth/login')}
                >
                  Đăng nhập
                </button>
              )}
              <Dropdown dropdownRender={cartMenuComponent} trigger={['click']} placement="bottomRight">
                <button
                  type="button"
                  className="store-header__icon-btn store-header__cart"
                  aria-label={`Giỏ hàng, ${totalCartItem} sản phẩm`}
                >
                  <Badge count={totalCartItem} size="small" offset={[-2, 2]}>
                    <span className="store-header__cart-icon">
                      <BiCart aria-hidden />
                    </span>
                  </Badge>
                  <span className="store-header__cart-label">Giỏ hàng</span>
                </button>
              </Dropdown>
            </div>
          </div>

          <div className="store-header__search store-header__search--mobile">
            <ShopeeSearch />
          </div>
        </div>
      </div>

      <Drawer title="Menu" placement="left" onClose={closeDrawer} open={drawerOpen} width={280}>
        <nav className="store-header__drawer-links" aria-label="Menu di động">
          <button type="button" onClick={() => navTo('/user')}>
            Trang chủ
          </button>
          <button type="button" onClick={() => navTo('/user/cart')}>
            Giỏ hàng
          </button>
          {user?.id ? (
            <>
              <button type="button" onClick={() => navTo('/user/profile')}>
                Trang cá nhân
              </button>
              <button type="button" onClick={() => navTo('/user/orderstatus')}>
                Đơn mua
              </button>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  closeDrawer();
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <button type="button" onClick={() => navTo('/auth/login')}>
              Đăng nhập
            </button>
          )}
        </nav>
      </Drawer>
    </header>
  );
}

export default memo(Header);
