import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Skeleton } from 'antd';
import { getAllProduct, getProductsByCategory } from '../../api/product/product.api';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import ProductCard from '../../components/ui/ProductCard';
import EmptyState from '../../components/ui/EmptyState';
import '../../css/ProductCard.css';

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const keyword = searchParams.get('keyword')?.trim() ?? '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pageTitle = keyword
    ? `Kết quả tìm kiếm: "${keyword}"`
    : products[0]?.categoryName
      ? String(products[0].categoryName)
      : 'Sản phẩm';

  const fetchProducts = useCallback(async () => {
    if (!categoryId && !keyword) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const body = {
        pageInfo: { page: 1, pageSize: 20 },
        keyWord: keyword,
        filter: {},
        sorts: {},
      };

      let data: any[] = [];

      if (categoryId) {
        const res = await getProductsByCategory(categoryId, body);
        const typed = res as { success?: boolean; data?: any[] };
        if (typed?.success && Array.isArray(typed.data)) {
          data = typed.data;
        }
      } else {
        const res = await getAllProduct(body);
        const typed = res as { success?: boolean; data?: any[] };
        if (typed?.success && Array.isArray(typed.data)) {
          data = typed.data.filter(
            (p) =>
              (p as { isActive?: boolean }).isActive !== false &&
              (p as { sellerStatus?: boolean }).sellerStatus !== false
          );
        }
      }

      setProducts(data);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, keyword]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const emptyDescription = keyword
    ? `Không tìm thấy sản phẩm cho "${keyword}"`
    : 'Không có sản phẩm nào trong danh mục này';

  return (
    <PageContainer>
      <PageHeader
        title={loading && products.length === 0 ? 'Đang tải...' : pageTitle}
        breadcrumbs={[
          { title: 'Trang chủ', href: '/user' },
          { title: keyword ? 'Tìm kiếm' : 'Danh mục' },
        ]}
        extra={
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/user')}
          >
            Quay lại
          </Button>
        }
      />

      {loading ? (
        <div className="product-grid-skeleton">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.Image key={i} active style={{ width: '100%', height: 200 }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          description={
            !categoryId && !keyword
              ? 'Chọn danh mục hoặc tìm kiếm sản phẩm'
              : emptyDescription
          }
          actionLabel="Xem trang chủ"
          onAction={() => navigate('/user')}
        />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(id) => navigate(`/user/products/${id}`)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default ProductsPage;
