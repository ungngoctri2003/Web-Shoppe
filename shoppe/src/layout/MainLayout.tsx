import React, { useMemo, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Image, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { MenuProps } from 'antd';
import { getMenuByRole } from './MenuIttem';
import { getRoleIdState, resetLogin } from '../features/slices/app.slice';
import logo from '../assets/img/logo.png';
import person from '../assets/img/person.png';
import { InfoUserState, resetUserState } from '../features/slices/user.slice';
import '../css/layout/MainLayout.css';

const { Header, Sider, Content, Footer } = Layout;

interface MainLayoutProps {
  basePath: 'Admin' | 'Seller' | 'User';
}

const MainLayout: React.FC<MainLayoutProps> = ({ basePath }) => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector(InfoUserState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const roleId = useSelector(getRoleIdState);
  const menuItems = getMenuByRole(roleId);

  const roleLabel = basePath === 'Admin' ? 'Admin' : 'Seller';

  const selectedKey = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) return parts[1];
    return 'dashboard';
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    dispatch(resetUserState());
    dispatch(resetLogin());
    navigate('/auth/login');
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate(`/${basePath.toLowerCase()}/profile`),
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="backoffice-layout">
      <a href="#backoffice-main" className="skip-link">
        Chuyển tới nội dung chính
      </a>
      <Sider trigger={null} collapsible collapsed={collapsed} width={240}>
        <div
          className={`backoffice-layout__logo-wrap${collapsed ? ' backoffice-layout__logo-wrap--collapsed' : ''}`}
        >
          <img src={logo} alt="T2 SHOP" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(`/${basePath.toLowerCase()}/${key}`)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="backoffice-layout__header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Mở sidebar' : 'Thu gọn sidebar'}
          />
          {user && (
            <div className="backoffice-layout__header-right">
              <span className="backoffice-layout__role-badge">{roleLabel}</span>
              <span className="backoffice-layout__user-greeting">
                Xin chào, {user?.fullName || 'User'}
              </span>
              <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" arrow>
                <div className="backoffice-layout__user-chip">
                  <Image
                    src={user.avatar || person}
                    alt="Avatar người dùng"
                    preview={false}
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </Dropdown>
            </div>
          )}
        </Header>
        <Content id="backoffice-main" className="backoffice-layout__content" role="main">
          <Outlet />
        </Content>
        <Footer className="backoffice-layout__footer">
          T2 SHOP · Bảng quản trị
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
