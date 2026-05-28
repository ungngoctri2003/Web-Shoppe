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
  eyebrow?: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: ReactNode;
  variant?: 'default' | 'rich';
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  breadcrumbs,
  extra,
  variant = 'default',
}: PageHeaderProps) {
  const isRich = variant === 'rich';

  return (
    <div className={`page-header${isRich ? ' page-header--rich' : ''}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          className="page-header__breadcrumb"
          items={breadcrumbs.map((b) => ({
            title: b.href ? <a href={b.href}>{b.title}</a> : b.title,
          }))}
        />
      )}
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16}>
        <div className="page-header__main">
          {(eyebrow || isRich) && (
            <span className="page-header__eyebrow">
              {eyebrow ?? breadcrumbs?.[breadcrumbs.length - 1]?.title}
            </span>
          )}
          <Title
            level={isRich ? 3 : 4}
            className="page-header__title"
            style={{ margin: 0 }}
          >
            {title}
          </Title>
          {subtitle && (
            <Typography.Text type="secondary" className="page-header__subtitle">
              {subtitle}
            </Typography.Text>
          )}
        </div>
        {extra && <div className="page-header__extra">{extra}</div>}
      </Flex>
    </div>
  );
}
