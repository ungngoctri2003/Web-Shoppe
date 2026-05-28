import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  BiAward,
  BiCheckShield,
  BiHeart,
  BiRocket,
  BiStore,
  BiSupport,
  BiTrendingUp,
  BiPackage,
} from 'react-icons/bi';
import { ArrowRightOutlined } from '@ant-design/icons';
import PageContainer from '../../components/ui/PageContainer';
import RevealSection from '../../components/ui/RevealSection';
import logoImg from '../../assets/img/logo.png';
import '../../css/pages/AboutPage.css';

const STATS = [
  { value: 50, suffix: 'K+', label: 'Khách hàng tin dùng' },
  { value: 10, suffix: 'K+', label: 'Sản phẩm đa dạng' },
  { value: 99, suffix: '%', label: 'Đơn giao đúng hẹn' },
  { value: 24, suffix: '/7', label: 'Hỗ trợ trực tuyến' },
];

const VALUES = [
  {
    icon: BiCheckShield,
    title: 'An toàn & minh bạch',
    desc: 'Mọi giao dịch được bảo vệ, thông tin sản phẩm rõ ràng, đánh giá thật từ người mua.',
  },
  {
    icon: BiPackage,
    title: 'Giao hàng nhanh',
    desc: 'Mạng lưới vận chuyển rộng khắp, cập nhật trạng thái đơn hàng theo thời gian thực.',
  },
  {
    icon: BiSupport,
    title: 'Chăm sóc tận tâm',
    desc: 'Đội ngũ hỗ trợ sẵn sàng giải đáp, đổi trả linh hoạt khi có phát sinh.',
  },
  {
    icon: BiTrendingUp,
    title: 'Giá tốt mỗi ngày',
    desc: 'Flash sale, voucher và ưu đãi độc quyền giúp bạn mua sắm thông minh hơn.',
  },
];

const MILESTONES = [
  { year: '2022', title: 'Ra mắt T2 SHOP', desc: 'Khởi đầu hành trình thương mại điện tử phục vụ người Việt.' },
  { year: '2023', title: 'Mở rộng danh mục', desc: 'Hàng nghìn nhà bán và sản phẩm từ điện tử đến thời trang.' },
  { year: '2024', title: 'Trải nghiệm mới', desc: 'Giao diện hiện đại, thanh toán đa kênh, theo dõi đơn realtime.' },
  { year: '2025', title: 'Tương lai xanh', desc: 'Cam kết đóng gói thân thiện môi trường và giao hàng bền vững.' },
];

const FEATURES = [
  'Tìm kiếm & lọc sản phẩm thông minh',
  'Giỏ hàng đồng bộ khi đăng nhập',
  'Voucher & khuyến mãi tích hợp',
  'Theo dõi đơn hàng chi tiết',
  'Đánh giá & xếp hạng uy tín',
  'Bảo mật thông tin cá nhân',
];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let frame: number;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return count;
}

function StatCard({
  value,
  suffix,
  label,
  active,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  const count = useCountUp(value, active);

  return (
    <div className="about-stat" style={{ transitionDelay: `${delay}ms` }}>
      <span className="about-stat__value">
        {count}
        {suffix}
      </span>
      <span className="about-stat__label">{label}</span>
    </div>
  );
}

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <PageContainer className="about-page">
      {/* Hero */}
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero__orbs" aria-hidden>
          <span className="about-hero__orb about-hero__orb--1" />
          <span className="about-hero__orb about-hero__orb--2" />
          <span className="about-hero__orb about-hero__orb--3" />
        </div>
        <div className="about-hero__grid" aria-hidden />
        <div className="about-hero__content">
          <span className="about-hero__badge">Về chúng tôi</span>
          <h1 id="about-hero-title" className="about-hero__title">
            T2 SHOP — Nơi mua sắm
            <span className="about-hero__title-accent"> thông minh</span>
          </h1>
          <p className="about-hero__lead">
            Nền tảng thương mại điện tử hiện đại, kết nối bạn với hàng ngàn sản phẩm chất lượng,
            trải nghiệm mượt mà và dịch vụ tận tâm trên mọi đơn hàng.
          </p>
          <div className="about-hero__actions">
            <Link to="/user/products">
              <Button type="primary" size="large" icon={<BiStore />}>
                Khám phá sản phẩm
              </Button>
            </Link>
            <Link to="/user">
              <Button size="large" ghost className="about-hero__btn-ghost">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
        <div className="about-hero__visual" aria-hidden>
          <div className="about-hero__visual-ring" />
          <img src={logoImg} alt="Logo T2 SHOP" className="about-hero__visual-img" />
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className={`about-stats${statsActive ? ' about-stats--active' : ''}`}>
        {STATS.map((s, i) => (
          <StatCard
            key={s.label}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            active={statsActive}
            delay={i * 80}
          />
        ))}
      </section>

      {/* Story */}
      <RevealSection>
        <section className="about-story" aria-labelledby="about-story-title">
          <div className="about-story__media">
            <div className="about-story__media-frame">
              <img src={logoImg} alt="Logo T2 SHOP" loading="lazy" className="about-story__logo" />
              <div className="about-story__float-card about-story__float-card--1">
                <BiHeart />
                <span>100K+ lượt yêu thích</span>
              </div>
              <div className="about-story__float-card about-story__float-card--2">
                <BiAward />
                <span>Top uy tín 2024</span>
              </div>
            </div>
          </div>
          <div className="about-story__text">
            <span className="about-section-eyebrow">Câu chuyện</span>
            <h2 id="about-story-title" className="about-section-title">
              Sứ mệnh của chúng tôi
            </h2>
            <p>
              T2 SHOP ra đời với mong muốn democratize việc mua sắm trực tuyến — ai cũng có thể
              tiếp cận sản phẩm chính hãng, giá minh bạch và trải nghiệm không kém các sàn quốc tế.
            </p>
            <p>
              Chúng tôi không ngừng đầu tư công nghệ, logistics và đội ngũ chăm sóc khách hàng để
              mỗi lần bạn bấm &quot;Đặt hàng&quot; đều là một trải nghiệm đáng tin cậy.
            </p>
            <ul className="about-story__list">
              <li>
                <BiCheckShield /> Bảo vệ người mua trên mọi giao dịch
              </li>
              <li>
                <BiRocket /> Cập nhật tính năng liên tục theo phản hồi
              </li>
            </ul>
          </div>
        </section>
      </RevealSection>

      {/* Values */}
      <RevealSection delay={60}>
        <section className="about-values" aria-labelledby="about-values-title">
          <header className="about-section-head">
            <span className="about-section-eyebrow">Giá trị cốt lõi</span>
            <h2 id="about-values-title" className="about-section-title about-section-title--center">
              Vì sao chọn T2 SHOP?
            </h2>
          </header>
          <div className="about-values__grid">
            {VALUES.map((item, i) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="about-value-card"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="about-value-card__icon">
                    <Icon aria-hidden />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              );
            })}
          </div>
        </section>
      </RevealSection>

      {/* Timeline */}
      <RevealSection delay={80}>
        <section className="about-timeline" aria-labelledby="about-timeline-title">
          <header className="about-section-head">
            <span className="about-section-eyebrow">Hành trình</span>
            <h2 id="about-timeline-title" className="about-section-title about-section-title--center">
              Các cột mốc phát triển
            </h2>
          </header>
          <ol className="about-timeline__track">
            {MILESTONES.map((m, i) => (
              <li
                key={m.year}
                className="about-timeline__item"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="about-timeline__dot" aria-hidden />
                <div className="about-timeline__card">
                  <span className="about-timeline__year-badge">{m.year}</span>
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </RevealSection>

      {/* Features list */}
      <RevealSection delay={100}>
        <section className="about-features" aria-labelledby="about-features-title">
          <div className="about-features__inner">
            <div className="about-features__copy">
              <span className="about-section-eyebrow about-section-eyebrow--light">Nền tảng</span>
              <h2 id="about-features-title" className="about-section-title about-section-title--light">
                Trải nghiệm được thiết kế cho bạn
              </h2>
              <p>
                Từ tìm kiếm đến thanh toán — mọi bước đều tối giản, nhanh và an toàn trên mọi thiết
                bị.
              </p>
            </div>
            <ul className="about-features__list">
              {FEATURES.map((f, i) => (
                <li key={f} style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="about-features__check" aria-hidden>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RevealSection>

      {/* CTA */}
      <RevealSection delay={120}>
        <section className="about-cta" aria-label="Bắt đầu mua sắm">
          <div className="about-cta__glow" aria-hidden />
          <h2 className="about-cta__title">Sẵn sàng mua sắm thông minh?</h2>
          <p className="about-cta__sub">Hàng ngàn deal đang chờ bạn — bắt đầu ngay hôm nay.</p>
          <Link to="/user/products">
            <Button
              type="primary"
              size="large"
              className="about-cta__btn"
              icon={<ArrowRightOutlined />}
            >
              Xem tất cả sản phẩm
            </Button>
          </Link>
        </section>
      </RevealSection>
    </PageContainer>
  );
}
