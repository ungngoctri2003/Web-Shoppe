import type { CSSProperties, ReactNode } from 'react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
};

export default function RevealSection({
  children,
  className = '',
  delay = 0,
  style,
}: RevealSectionProps) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={['home-reveal', visible ? 'home-reveal--visible' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
