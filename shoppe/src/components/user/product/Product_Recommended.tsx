import { Pagination, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProduct } from '../../../api/product/product.api';
import ProductCard from '../../ui/ProductCard';
import EmptyState from '../../ui/EmptyState';
import '../../../css/ProductCard.css';

function ProductRecommended() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [total, setTotal] = useState(0);

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const res: any = await getAllProduct({
        pageInfo: { page, pageSize },
        keyWord: '',
      });
      if (!res?.success || !Array.isArray(res.data)) return;
      const activeProducts = res.data.filter(
        (p: any) => p.isActive !== false && p.sellerStatus !== false
      );
      setProducts(activeProducts);
      setTotal(res.totalRecord || 0);
    } catch (error) {
      console.error('Lỗi tải dữ liệu sản phẩm', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="product-grid-skeleton">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton.Image key={i} active style={{ width: '100%', height: 200 }} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        description="Chưa có sản phẩm gợi ý"
        actionLabel="Về trang chủ"
        onAction={() => navigate('/user')}
      />
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={(id) => navigate(`/user/products/${id}`)}
          />
        ))}
      </div>
      {total > pageSize && (
        <div className="product-grid__pagination">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger={false}
            showTotal={(t, range) => `${range[0]}-${range[1]} của ${t} sản phẩm`}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default ProductRecommended;
