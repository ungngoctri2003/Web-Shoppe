import { BiBoltCircle, BiGift, BiRocket, BiTag } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import '../../../css/components/home/HomeDealHighlights.css';

const DEALS = [
  {
    icon: BiBoltCircle,
    title: 'Flash Sale',
    desc: 'Giảm đến 70% — cập nhật mỗi giờ',
    path: '/user/products?keyword=',
    accent: 'brand',
  },
  {
    icon: BiTag,
    title: 'Voucher hot',
    desc: 'Mã giảm 50K cho đơn đầu',
    path: '/user/cart',
    accent: 'blue',
  },
  {
    icon: BiRocket,
    title: 'Hàng mới về',
    desc: 'Xu hướng tuần này',
    path: '/user/products?keyword=',
    accent: 'purple',
  },
  {
    icon: BiGift,
    title: 'Quà tặng',
    desc: 'Tích điểm đổi quà',
    path: '/user/about',
    accent: 'green',
  },
] as const;

export default function HomeDealHighlights() {
  const navigate = useNavigate();

  return (
    <section className="home-deals" aria-labelledby="home-deals-heading">
      <div className="home-deals__header">
        <div>
          <span className="home-deals__eyebrow">Ưu đãi</span>
          <h2 id="home-deals-heading" className="home-deals__title">
            Khuyến mãi nổi bật
          </h2>
        </div>
        <button
          type="button"
          className="home-deals__more"
          onClick={() => navigate('/user/products?keyword=')}
        >
          Xem tất cả
        </button>
      </div>
      <div className="home-deals__grid">
        {DEALS.map(({ icon: Icon, title, desc, path, accent }, index) => (
          <button
            key={title}
            type="button"
            className={`home-deals__card home-deals__card--${accent}`}
            style={{ animationDelay: `${index * 70}ms` }}
            onClick={() => navigate(path)}
          >
            <span className="home-deals__card-icon" aria-hidden>
              <Icon />
            </span>
            <span className="home-deals__card-title">{title}</span>
            <span className="home-deals__card-desc">{desc}</span>
            <span className="home-deals__card-arrow" aria-hidden>
              →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
