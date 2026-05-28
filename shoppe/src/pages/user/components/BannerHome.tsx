import { Col, Row } from 'antd';
import { memo } from 'react';
import BannerSlider from '../../../components/user/banner/BannerSlider';
import BannerStatic from '../../../components/user/banner/BannerStatic';
import '../../../css/components/banner/BannerHome.css';

function BannerHome() {
  return (
    <Row gutter={[10, 10]} className="banner-home" align="stretch">
      <Col xs={24} lg={16} className="banner-home__slider-col">
        <BannerSlider bannerTypes={['homepage', 'Top Banner', 'Top Banner 1']} />
      </Col>

      <Col xs={0} lg={8} className="banner-home__aside-col">
        <div className="banner-home__aside">
          <BannerStatic bannerType="Top Banner" index={0} />
          <BannerStatic bannerType="Top Banner 1" index={0} />
        </div>
      </Col>
    </Row>
  );
}

export default memo(BannerHome);
