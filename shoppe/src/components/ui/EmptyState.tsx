import { Button, Empty } from 'antd';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  image?: ReactNode;
}

export default function EmptyState({
  description = 'Không có dữ liệu',
  actionLabel,
  onAction,
  image = Empty.PRESENTED_IMAGE_SIMPLE,
}: EmptyStateProps) {
  return (
    <Empty
      image={image}
      description={description}
      style={{ padding: 'var(--space-7) 0' }}
    >
      {actionLabel && onAction && (
        <Button type="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Empty>
  );
}
