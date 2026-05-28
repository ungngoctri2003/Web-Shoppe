import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getBannerByType } from '../../../api/banner/banner.api';
import LoadingDefault from '../../loading/LoadingDefault';
import { getBannerLinkValue } from '../../../untils/bannerLink';
import BannerClickable from './BannerClickable';
import '../../../css/components/banner/BannerStatic.css';

interface BannerStaticProps {
  bannerType: string;
  index: number;
}

const BannerStatic = ({ bannerType, index }: BannerStaticProps) => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res: any = await getBannerByType(bannerType.toLowerCase());
      if (res.success) {
        setBanners(res.data || []);
      } else {
        message.error('Không thể lấy danh sách banner');
      }
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi khi tải banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [bannerType]);

  if (loading) {
    return <LoadingDefault />;
  }

  const banner = banners[index];
  if (!banner) {
    return null;
  }

  const img = (
    <img
      src={banner.imageUrl}
      alt={banner.title || 'Banner'}
      className="banner-static__img"
      loading="lazy"
      decoding="async"
    />
  );

  return (
    <div className="banner-static">
      <BannerClickable
        linkTo={getBannerLinkValue(banner)}
        className="banner-static__link"
        ariaLabel={banner.title || 'Banner'}
      >
        {img}
      </BannerClickable>
    </div>
  );
};

export default BannerStatic;
