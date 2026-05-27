import { Breadcrumb, Flex, Typography } from 'antd';
import type { ReactNode } from 'react';
import '../../css/components/ui/PageHeader.css';

const { Title } = Typography;

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  extra,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: 'var(--space-2)' }}
          items={breadcrumbs.map((b) => ({
            title: b.href ? <a href={b.href}>{b.title}</a> : b.title,
          }))}
        />
      )}
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16}>
        <div>
          <Title level={4} className="page-header__title" style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Typography.Text type="secondary" className="page-header__subtitle">
              {subtitle}
            </Typography.Text>
          )}
        </div>
        {extra && <div>{extra}</div>}
      </Flex>
    </div>
  );
}
