import { Row, Col } from 'antd';
import type { ReactNode } from 'react';
import backgroundImg from '../../assets/img/background.jpg';
import '../../css/layout/AuthLayout.css';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: ReactNode;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Row className="auth-layout">
      <Col xs={24} md={12} className="auth-layout__form-col">
        <div className="auth-layout__form-wrap">
          {title && <h1 className="auth-layout__title">{title}</h1>}
          {subtitle && <div className="auth-layout__subtitle">{subtitle}</div>}
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
