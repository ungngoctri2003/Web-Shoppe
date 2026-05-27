import CategoryButton from '../../components/user/category/CategoryButton';
import ProductRecommended from '../../components/user/product/Product_Recommended';
import PromoBanner from '../../components/user/home/PromoBanner';
import ServiceStrip from '../../components/user/home/ServiceStrip';
import PageContainer from '../../components/ui/PageContainer';
import BannerHome from './components/BannerHome';

export default function HomePage() {
  return (
    <PageContainer>
      <BannerHome />
      <ServiceStrip />
      <PromoBanner />
      <CategoryButton />
      <section className="page-section page-section--featured" aria-labelledby="recommended-heading">
        <div className="page-section__header page-section__header--rich">
          <div className="page-section__header-inner">
            <span className="page-section__eyebrow">Dành cho bạn</span>
            <h2 id="recommended-heading" className="page-section__title page-section__title--left">
              Gợi ý hôm nay
            </h2>
            <p className="page-section__subtitle">Sản phẩm hot được cập nhật liên tục</p>
          </div>
        </div>
        <div className="page-section__body page-section__body--no-padding">
          <ProductRecommended />
        </div>
      </section>
    </PageContainer>
  );
}
