import { BiCar, BiGift, BiShield, BiWallet } from 'react-icons/bi';
import '../../../css/components/home/ServiceStrip.css';

const SERVICES = [
  { icon: BiCar, title: 'Freeship', desc: 'Đơn từ 0đ' },
  { icon: BiGift, title: 'Voucher', desc: 'Giảm đến 50%' },
  { icon: BiWallet, title: 'Hoàn tiền', desc: 'Mua là có quà' },
  { icon: BiShield, title: 'Chính hãng', desc: 'Bảo vệ người mua' },
] as const;

export default function ServiceStrip() {
  return (
    <div className="service-strip" role="list" aria-label="Ưu đãi dịch vụ">
      {SERVICES.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="service-strip__item" role="listitem">
          <span className="service-strip__icon" aria-hidden>
            <Icon />
          </span>
          <div className="service-strip__text">
            <span className="service-strip__title">{title}</span>
            <span className="service-strip__desc">{desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
