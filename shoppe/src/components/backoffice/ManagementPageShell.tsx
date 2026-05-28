import type { ReactNode } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import PageHeader, { type BreadcrumbItem } from '../ui/PageHeader';
import RevealSection from '../ui/RevealSection';
import '../../css/components/backoffice/ManagementPageShell.css';

interface ManagementPageShellProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  breadcrumbs?: BreadcrumbItem[];
  onAdd?: () => void;
  addLabel?: string;
  search?: {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
  };
  headerExtra?: ReactNode;
  children: ReactNode;
}

export default function ManagementPageShell({
  title,
  subtitle,
  eyebrow,
  breadcrumbs,
  onAdd,
  addLabel = 'Thêm mới',
  search,
  headerExtra,
  children,
}: ManagementPageShellProps) {
  const toolbarExtra = (
    <div className="management-shell__toolbar-actions">
      {search && (
        <Search
          placeholder={search.placeholder ?? 'Tìm kiếm...'}
          value={search.value}
          onChange={(e) => search.onChange?.(e.target.value)}
          onSearch={search.onSearch}
          className="management-shell__search"
          allowClear
        />
      )}
      {headerExtra}
      {onAdd && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          {addLabel}
        </Button>
      )}
    </div>
  );

  return (
    <div className="management-shell">
      <RevealSection delay={0}>
        <PageHeader
          variant="rich"
          eyebrow={eyebrow ?? breadcrumbs?.[breadcrumbs.length - 1]?.title}
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          extra={toolbarExtra}
        />
      </RevealSection>
      <RevealSection delay={80}>
        <div className="management-shell__table page-section">{children}</div>
      </RevealSection>
    </div>
  );
}
