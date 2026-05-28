import type { ReactNode } from 'react';
import { Card, Spin } from 'antd';
import RevealSection from '../ui/RevealSection';
import EmptyState from '../ui/EmptyState';
import '../../css/components/backoffice/ChartSection.css';

interface ChartSectionProps {
  title: string;
  eyebrow?: string;
  extra?: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyDescription?: string;
  delay?: number;
  children: ReactNode;
}

export default function ChartSection({
  title,
  eyebrow = 'Thống kê',
  extra,
  loading = false,
  empty = false,
  emptyDescription = 'Chưa có dữ liệu để hiển thị',
  delay = 0,
  children,
}: ChartSectionProps) {
  return (
    <RevealSection delay={delay}>
      <Card
        className="chart-section page-section page-section--featured"
        bordered={false}
        title={
          <div className="chart-section__header">
            <span className="chart-section__eyebrow">{eyebrow}</span>
            <h3 className="chart-section__title">{title}</h3>
          </div>
        }
        extra={extra}
      >
        <Spin spinning={loading}>
          {empty && !loading ? (
            <EmptyState description={emptyDescription} />
          ) : (
            <div className="chart-section__body">{children}</div>
          )}
        </Spin>
      </Card>
    </RevealSection>
  );
}
