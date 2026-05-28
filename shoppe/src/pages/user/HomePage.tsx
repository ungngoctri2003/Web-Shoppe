import { useNavigate } from 'react-router-dom';
import CategoryButton from '../../components/user/category/CategoryButton';
import HomeDealHighlights from '../../components/user/home/HomeDealHighlights';
import HomeShopSteps from '../../components/user/home/HomeShopSteps';
import HomeStatsBar from '../../components/user/home/HomeStatsBar';
import HomeTrendingTags from '../../components/user/home/HomeTrendingTags';
import PromoBanner from '../../components/user/home/PromoBanner';
import ServiceStrip from '../../components/user/home/ServiceStrip';
import ProductRecommended from '../../components/user/product/Product_Recommended';
import PageContainer from '../../components/ui/PageContainer';
import RevealSection from '../../components/ui/RevealSection';
import BannerHome from './components/BannerHome';
import '../../css/pages/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="home-page">
      <RevealSection>
        <BannerHome />
      </RevealSection>

      <HomeStatsBar />
      <HomeTrendingTags />

      <RevealSection delay={80}>
        <ServiceStrip />
      </RevealSection>

      <RevealSection delay={120}>
        <PromoBanner />
      </RevealSection>

      <RevealSection delay={160}>
        <HomeDealHighlights />
      </RevealSection>

      <RevealSection delay={200}>
        <CategoryButton />
      </RevealSection>

      <RevealSection delay={240}>
        <HomeShopSteps />
      </RevealSection>

      <RevealSection>
        <section
          className="page-section page-section--featured home-page__products"
          aria-labelledby="recommended-heading"
        >
          <div className="page-section__header page-section__header--rich">
            <div className="page-section__header-inner">
              <span className="page-section__eyebrow">Dành cho bạn</span>
              <h2 id="recommended-heading" className="page-section__title page-section__title--left">
                Gợi ý hôm nay
              </h2>
              <p className="page-section__subtitle">
                Sản phẩm hot được cập nhật liên tục — giao nhanh, đổi trả dễ dàng
              </p>
            </div>
          </div>
          <div className="page-section__body page-section__body--no-padding">
            <ProductRecommended staggerAnimate />
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <div className="home-page__cta">
          <div className="home-page__cta-inner">
            <h2 className="home-page__cta-title">Sẵn sàng mua sắm?</h2>
            <p className="home-page__cta-sub">
              Khám phá hàng ngàn sản phẩm chính hãng với ưu đãi hấp dẫn mỗi ngày
            </p>
            <button
              type="button"
              className="home-page__cta-btn"
              onClick={() => navigate('/user/products?keyword=')}
            >
              Khám phá ngay →
            </button>
          </div>
        </div>
      </RevealSection>
    </PageContainer>
  );
}
