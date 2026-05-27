import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../../css/components/home/PromoBanner.css';

export default function PromoBanner() {
  const navigate = useNavigate();

  return (
    <div className="promo-banner">
      <div className="promo-banner__flash">
        <span className="promo-banner__label">FLASH SALE</span>
        <div className="promo-banner__content">
          <p className="promo-banner__title">Giảm sốc mỗi ngày</p>
          <p className="promo-banner__sub">Hàng ngàn deal hot — số lượng có hạn</p>
        </div>
        <Button
          className="promo-banner__cta"
          size="middle"
          onClick={() => navigate('/user/products?keyword=')}
        >
          Mua ngay
        </Button>
      </div>

      <div className="promo-banner__side">
        <button
          type="button"
          className="promo-banner__side-card"
          onClick={() => navigate('/user/cart')}
        >
          <span className="promo-banner__side-tag">Voucher</span>
          <span className="promo-banner__side-text">Nhận mã giảm giá</span>
        </button>
        <button
          type="button"
          className="promo-banner__side-card"
          onClick={() => navigate('/user/orderstatus')}
        >
          <span className="promo-banner__side-tag">Đơn hàng</span>
          <span className="promo-banner__side-text">Theo dõi giao hàng</span>
        </button>
      </div>
    </div>
  );
}
