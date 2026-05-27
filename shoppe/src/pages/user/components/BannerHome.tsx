import { Col, Row } from 'antd';
import { memo } from 'react';
import BannerSlider from '../../../components/user/banner/BannerSlider';
import BannerStatic from '../../../components/user/banner/BannerStatic';
import '../../../css/components/banner/BannerHome.css';

function BannerHome() {
  return (
    <Row gutter={[8, 8]} className="banner-home">
      <Col xs={24} md={15} className="banner-home__slider-col">
        <BannerSlider bannerTypes={['homepage', 'Top Banner', 'Top Banner 1']} />
      </Col>

      <Col xs={0} sm={0} md={9} className="banner-home__static-col">
        <div className="banner-home__static-item">
          <BannerStatic bannerType="homepage" index={0} />
        </div>
        <div className="banner-home__static-item">
          <BannerStatic bannerType="Top Banner" index={1} />
        </div>
        <div className="banner-home__static-item">
          <BannerStatic bannerType="Top Banner 1" index={2} />
        </div>
      </Col>
    </Row>
  );
}

export default memo(BannerHome);
