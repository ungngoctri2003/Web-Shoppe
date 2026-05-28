import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../css/components/home/PromoBanner.css';

function getTimeLeft() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function PromoBanner() {
  const navigate = useNavigate();
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="promo-banner">
      <div className="promo-banner__flash">
        <span className="promo-banner__label promo-banner__label--pulse">FLASH SALE</span>
        <div className="promo-banner__content">
          <p className="promo-banner__title">Giảm sốc mỗi ngày</p>
          <p className="promo-banner__sub">Hàng ngàn deal hot — số lượng có hạn</p>
          <div className="promo-banner__countdown" aria-live="polite">
            <span className="promo-banner__countdown-label">Kết thúc sau</span>
            <div className="promo-banner__timer">
              <span className="promo-banner__time-block">
                <strong>{pad(time.h)}</strong>
                <small>Giờ</small>
              </span>
              <span className="promo-banner__time-sep">:</span>
              <span className="promo-banner__time-block">
                <strong>{pad(time.m)}</strong>
                <small>Phút</small>
              </span>
              <span className="promo-banner__time-sep">:</span>
              <span className="promo-banner__time-block">
                <strong>{pad(time.s)}</strong>
                <small>Giây</small>
              </span>
            </div>
          </div>
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
          <span className="promo-banner__side-hint">Tiết kiệm đến 50%</span>
        </button>
        <button
          type="button"
          className="promo-banner__side-card"
          onClick={() => navigate('/user/orderstatus')}
        >
          <span className="promo-banner__side-tag">Đơn hàng</span>
          <span className="promo-banner__side-text">Theo dõi giao hàng</span>
          <span className="promo-banner__side-hint">Cập nhật realtime</span>
        </button>
      </div>
    </div>
  );
}
