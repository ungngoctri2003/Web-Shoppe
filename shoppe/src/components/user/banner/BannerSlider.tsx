import { useEffect, useState } from 'react';
import { Carousel, message } from 'antd';
import { getBannerByType } from '../../../api/banner/banner.api';
import LoadingDefault from '../../loading/LoadingDefault';
import { getBannerLinkValue } from '../../../untils/bannerLink';
import BannerClickable from './BannerClickable';
import '../../../css/components/banner/BannerSlider.css';

interface BannerSliderProps {
  bannerTypes: string[];
}

const BannerSlider = ({ bannerTypes }: BannerSliderProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      let allBanners: any[] = [];

      for (const type of bannerTypes) {
        const res: any = await getBannerByType(type.toLowerCase());
        if (res.success) {
          allBanners = [...allBanners, ...(res.data || [])];
        }
      }

      setData(allBanners);
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi khi tải banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [bannerTypes]);

  if (loading) {
    return <LoadingDefault />;
  }

  if (!data.length) {
    return null;
  }

  return (
    <Carousel
      autoplay
      autoplaySpeed={4500}
      pauseOnHover
      dots
      arrows
      effect="fade"
      className="banner-slider"
    >
      {data.map((banner: any) => {
        const img = (
          <img
            src={banner.imageUrl}
            alt={banner.title || 'Banner quảng cáo'}
            className="banner-slide__img"
            loading="lazy"
            decoding="async"
          />
        );

        return (
          <div key={banner.id} className="banner-slide">
            <BannerClickable
              linkTo={getBannerLinkValue(banner)}
              className="banner-slide__link"
              ariaLabel={banner.title || 'Banner'}
            >
              {img}
            </BannerClickable>
          </div>
        );
      })}
    </Carousel>
  );
};

export default BannerSlider;
