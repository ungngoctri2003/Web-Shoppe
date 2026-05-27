import { Layout } from 'antd';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import '../css/layout/UserStorefront.css';

const { Content } = Layout;

export default function UserLayout() {
  return (
    <Layout className="user-storefront">
      <a href="#main-content" className="skip-link">
        Chuyển tới nội dung chính
      </a>
      <Header />
      <Content id="main-content" role="main" className="user-storefront__main">
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
}
