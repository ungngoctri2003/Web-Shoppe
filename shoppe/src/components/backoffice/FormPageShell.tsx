import type { ReactNode } from 'react';
import { Button, Flex } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader, { type BreadcrumbItem } from '../ui/PageHeader';
import RevealSection from '../ui/RevealSection';
import '../../css/components/backoffice/FormPageShell.css';

interface FormPageShellProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  breadcrumbs?: BreadcrumbItem[];
  backTo?: string;
  children: ReactNode;
  footer?: ReactNode;
  onCancel?: () => void;
  cancelLabel?: string;
}

export default function FormPageShell({
  title,
  subtitle,
  eyebrow,
  breadcrumbs,
  backTo,
  children,
  footer,
  onCancel,
  cancelLabel = 'Quay lại',
}: FormPageShellProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="form-page-shell">
      <RevealSection delay={0}>
        <PageHeader
          variant="rich"
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          extra={
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              {cancelLabel}
            </Button>
          }
        />
      </RevealSection>
      <RevealSection delay={80}>
        <div className="form-page-shell__body page-section">{children}</div>
      </RevealSection>
      {(footer || onCancel || backTo) && (
        <div className="form-page-shell__footer">
          <Flex gap={12} justify="flex-end" wrap="wrap">
            {footer ?? (
              <Button onClick={handleBack}>{cancelLabel}</Button>
            )}
          </Flex>
        </div>
      )}
    </div>
  );
}
