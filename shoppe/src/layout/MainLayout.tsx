import React, { useMemo, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Image, Button, theme, Flex } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { MenuProps } from 'antd';
import { getMenuByRole } from './MenuIttem';
import { getRoleIdState, resetLogin } from '../features/slices/app.slice';
import logo from '../assets/img/logo_home.png';
import person from '../assets/img/person.png';
import { InfoUserState, resetUserState } from '../features/slices/user.slice';
import '../css/layout/MainLayout.css';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  basePath: 'Admin' | 'Seller' | 'User';
}

const MainLayout: React.FC<MainLayoutProps> = ({ basePath }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const user = useSelector(InfoUserState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const roleId = useSelector(getRoleIdState);
  const menuItems = getMenuByRole(roleId);

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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={240}>
        <div className="admin-layout__logo-wrap">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: collapsed ? 32 : 64,
              height: collapsed ? 32 : 64,
              objectFit: 'contain',
              transition: 'all 0.3s ease',
            }}
          />
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
        <Header className="admin-layout__header" style={{ background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Mở sidebar' : 'Thu gọn sidebar'}
          />
          {user && (
            <Flex gap={16} align="center">
              <span className="admin-layout__user-greeting">
                Xin chào, {user?.fullName || 'User'}
              </span>
              <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" arrow>
                <Image
                  src={user.avatar || person}
                  alt="Avatar người dùng"
                  preview={false}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                />
              </Dropdown>
            </Flex>
          )}
        </Header>
        <Content className="admin-layout__content">
          <main>
            <Outlet />
          </main>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
