import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function PageUnauthorized() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'var(--color-bg-layout)',
      }}
    >
      <Result
        status="403"
        title="Không có quyền truy cập"
        subTitle="Bạn không có quyền xem trang này. Vui lòng đăng nhập bằng tài khoản phù hợp hoặc quay về trang chủ."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/user')}>
            Về trang chủ
          </Button>,
          <Button key="login" onClick={() => navigate('/auth/login')}>
            Đăng nhập
          </Button>,
        ]}
      />
    </div>
  );
}
