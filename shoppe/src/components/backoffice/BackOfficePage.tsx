import type { ReactNode } from 'react';
import PageContainer from '../ui/PageContainer';
import '../../css/layout/BackOfficePage.css';

interface BackOfficePageProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function BackOfficePage({
  children,
  className = '',
  narrow = false,
}: BackOfficePageProps) {
  return (
    <PageContainer
      className={`backoffice-page ${narrow ? 'page-container--narrow' : ''} ${className}`.trim()}
    >
      {children}
    </PageContainer>
  );
}
