import { BiCart, BiSearch, BiWallet } from 'react-icons/bi';
import '../../../css/components/home/HomeShopSteps.css';

const STEPS = [
  {
    icon: BiSearch,
    step: '01',
    title: 'Tìm sản phẩm',
    desc: 'Duyệt danh mục hoặc tìm kiếm theo tên, thương hiệu',
  },
  {
    icon: BiCart,
    step: '02',
    title: 'Thêm vào giỏ',
    desc: 'Chọn biến thể, số lượng và áp dụng voucher',
  },
  {
    icon: BiWallet,
    step: '03',
    title: 'Thanh toán',
    desc: 'Đặt hàng an toàn — theo dõi giao hàng realtime',
  },
] as const;

export default function HomeShopSteps() {
  return (
    <section className="home-steps" aria-labelledby="home-steps-heading">
      <div className="home-steps__header">
        <span className="home-steps__eyebrow">Hướng dẫn</span>
        <h2 id="home-steps-heading" className="home-steps__title">
          Mua sắm chỉ 3 bước
        </h2>
        <p className="home-steps__sub">Trải nghiệm mua hàng nhanh, minh bạch và tiện lợi</p>
      </div>
      <ol className="home-steps__list">
        {STEPS.map(({ icon: Icon, step, title, desc }, index) => (
          <li
            key={step}
            className="home-steps__item"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="home-steps__num">{step}</span>
            <span className="home-steps__icon" aria-hidden>
              <Icon />
            </span>
            <h3 className="home-steps__item-title">{title}</h3>
            <p className="home-steps__item-desc">{desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
