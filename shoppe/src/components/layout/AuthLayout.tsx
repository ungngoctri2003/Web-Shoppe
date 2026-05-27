import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import backgroundImg from '../../assets/img/background.jpg';
import logo from '../../assets/img/logo_home.png';
import '../../css/layout/AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <Row className="auth-layout">
      <Col xs={24} md={12} className="auth-layout__form-col">
        <div className="auth-layout__form-wrap">
          <Link to="/user" className="auth-layout__logo-link">
            <img src={logo} alt="Trang chủ" className="auth-layout__logo" />
          </Link>
          {title && <h1 className="auth-layout__title">{title}</h1>}
          {children}
        </div>
      </Col>
      <Col xs={0} md={12} className="auth-layout__hero-col">
        <div
          className="auth-layout__hero"
          style={{ backgroundImage: `url(${backgroundImg})` }}
          aria-hidden
        />
      </Col>
    </Row>
  );
}
