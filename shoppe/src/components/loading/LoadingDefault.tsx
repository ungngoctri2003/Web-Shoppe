import { Spin } from 'antd';
import { memo } from 'react';

function LoadingDefault() {
  return (
    <div
      role="status"
      aria-label="Đang tải"
      style={{
        width: '100%',
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
    >
      <Spin size="large" tip="Đang tải..." />
    </div>
  );
}

export default memo(LoadingDefault);
