import { useEffect, useState } from 'react';
import { BiPackage, BiStore, BiSupport, BiTrendingUp } from 'react-icons/bi';
import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll';
import '../../../css/components/home/HomeStatsBar.css';

const STATS = [
  { icon: BiPackage, value: 12000, suffix: '+', label: 'Sản phẩm' },
  { icon: BiStore, value: 850, suffix: '+', label: 'Gian hàng uy tín' },
  { icon: BiTrendingUp, value: 98, suffix: '%', label: 'Khách hài lòng' },
  { icon: BiSupport, value: 24, suffix: '/7', label: 'Hỗ trợ trực tuyến' },
] as const;

function formatStat(value: number, suffix: string) {
  if (suffix === '+') return `${value >= 1000 ? `${Math.round(value / 1000)}K` : value}${suffix}`;
  if (suffix === '%') return `${value}${suffix}`;
  return `${value}${suffix}`;
}

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return count;
}

function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  active,
  index,
}: (typeof STATS)[number] & { active: boolean; index: number }) {
  const count = useCountUp(value, active);

  return (
    <div
      className="home-stats__item"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="home-stats__icon" aria-hidden>
        <Icon />
      </span>
      <div className="home-stats__content">
        <strong className="home-stats__value">{formatStat(count, suffix)}</strong>
        <span className="home-stats__label">{label}</span>
      </div>
    </div>
  );
}

export default function HomeStatsBar() {
  const { ref, visible } = useRevealOnScroll();

  return (
    <div
      ref={ref}
      className={['home-stats', visible ? 'home-stats--visible' : ''].filter(Boolean).join(' ')}
      aria-label="Thống kê cửa hàng"
    >
      {STATS.map((stat, index) => (
        <StatItem key={stat.label} {...stat} active={visible} index={index} />
      ))}
    </div>
  );
}
