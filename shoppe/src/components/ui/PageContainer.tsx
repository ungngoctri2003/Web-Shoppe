import type { CSSProperties, ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: number | string;
  className?: string;
  style?: CSSProperties;
}

export default function PageContainer({
  children,
  maxWidth = 'var(--content-max-width)',
  className = '',
  style,
}: PageContainerProps) {
  return (
    <div
      className={`page-container ${className}`.trim()}
      style={{
        maxWidth: maxWidth !== 'var(--content-max-width)' ? maxWidth : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
