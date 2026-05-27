import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
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
        status="404"
        title="Không tìm thấy trang"
        subTitle="Trang bạn truy cập không tồn tại hoặc đã bị di chuyển."
        extra={
          <Button type="primary" onClick={() => navigate('/user')}>
            Về trang chủ
          </Button>
        }
      />
    </div>
  );
}
