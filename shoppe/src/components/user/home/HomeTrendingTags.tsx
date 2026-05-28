import { useNavigate } from 'react-router-dom';
import '../../../css/components/home/HomeTrendingTags.css';

const TAGS = [
  'Điện thoại',
  'Laptop',
  'Tai nghe',
  'Thời trang',
  'Giày dép',
  'Mỹ phẩm',
  'Gia dụng',
  'Đồng hồ',
  'Phụ kiện',
  'Thể thao',
];

export default function HomeTrendingTags() {
  const navigate = useNavigate();

  return (
    <section className="home-trending" aria-label="Từ khóa tìm kiếm phổ biến">
      <span className="home-trending__label">🔥 Xu hướng:</span>
      <div className="home-trending__track">
        <div className="home-trending__scroll">
          {[...TAGS, ...TAGS].map((tag, i) => (
            <button
              key={`${tag}-${i}`}
              type="button"
              className="home-trending__tag"
              onClick={() => navigate(`/user/products?keyword=${encodeURIComponent(tag)}`)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
