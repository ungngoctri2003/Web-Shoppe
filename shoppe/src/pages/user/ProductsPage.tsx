import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Button, Input, Pagination, Select, Skeleton } from 'antd';
import {
  AppstoreOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { BiFilterAlt } from 'react-icons/bi';
import { getAllCategories } from '../../api/category/category.api';
import { getAllProduct, getProductsByCategory } from '../../api/product/product.api';
import PageContainer from '../../components/ui/PageContainer';
import ProductCard from '../../components/ui/ProductCard';
import EmptyState from '../../components/ui/EmptyState';
import {
  buildProductGridBody,
  parseProductListResponse,
} from '../../services/productList';
import '../../css/pages/ProductsPage.css';
import '../../css/ProductCard.css';

const PAGE_SIZE = 16;

type SortKey = 'newest' | 'price-asc' | 'price-desc';

function getMinPrice(product: {
  price?: number;
  variants?: { price: number }[];
}): number {
  const prices = product.variants?.map((v) => v.price) ?? [];
  if (prices.length > 0) return Math.min(...prices);
  return product.price ?? 0;
}

function sortProducts(items: any[], sort: SortKey): any[] {
  const list = [...items];
  if (sort === 'price-asc') {
    return list.sort((a, b) => getMinPrice(a) - getMinPrice(b));
  }
  if (sort === 'price-desc') {
    return list.sort((a, b) => getMinPrice(b) - getMinPrice(a));
  }
  return list;
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const keyword = searchParams.get('keyword')?.trim() ?? '';
  const pageFromUrl = Math.max(1, Number(searchParams.get('page')) || 1);

  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchDraft, setSearchDraft] = useState(keyword);
  const [sort, setSort] = useState<SortKey>('newest');
  const [categories, setCategories] = useState<{ id: string; name: string; imageUrl?: string }[]>(
    []
  );
  const navigate = useNavigate();

  useEffect(() => {
    setSearchDraft(keyword);
  }, [keyword]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res: any = await getAllCategories({
          pageInfo: { page: 1, pageSize: 24 },
          keyWord: '',
          filter: {},
          sorts: {},
        });
        if (res?.success && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch {
        /* optional sidebar */
      }
    };
    loadCategories();
  }, []);

  const activeCategoryName = useMemo(
    () => categories.find((c) => c.id === categoryId)?.name,
    [categories, categoryId]
  );

  const pageTitle = useMemo(() => {
    if (keyword) return `“${keyword}”`;
    if (activeCategoryName) return activeCategoryName;
    if (categoryId) return 'Danh mục';
    return 'Khám phá sản phẩm';
  }, [keyword, activeCategoryName, categoryId]);

  const pageSubtitle = useMemo(() => {
    if (keyword) return 'Kết quả tìm kiếm trên toàn cửa hàng';
    if (categoryId) return 'Sản phẩm được chọn theo danh mục';
    return 'Hàng ngàn mặt hàng — giao nhanh, giá tốt mỗi ngày';
  }, [keyword, categoryId]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const body = buildProductGridBody(pageFromUrl, PAGE_SIZE, keyword);
      let res: { success?: boolean; data?: unknown[]; totalRecord?: number };

      if (categoryId) {
        res = (await getProductsByCategory(categoryId, body)) as typeof res;
        let { items, total: totalCount } = parseProductListResponse(res);

        if (keyword) {
          const lower = keyword.toLowerCase();
          items = items.filter((p) =>
            String(p.productName ?? '')
              .toLowerCase()
              .includes(lower)
          );
          totalCount = items.length;
        }

        setProducts(items);
        setTotal(totalCount);
      } else {
        res = (await getAllProduct(body)) as typeof res;
        const { items, total: totalCount } = parseProductListResponse(res);
        setProducts(items);
        setTotal(totalCount);
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [categoryId, keyword, pageFromUrl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sortedProducts = useMemo(() => sortProducts(products, sort), [products, sort]);

  const hasFilters = Boolean(keyword || categoryId);

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    if (page <= 1) next.delete('page');
    else next.set('page', String(page));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applySearch = () => {
    const next = new URLSearchParams(searchParams);
    const q = searchDraft.trim();
    if (q) next.set('keyword', q);
    else next.delete('keyword');
    next.delete('page');
    setSearchParams(next);
  };

  const selectCategory = (id: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (id) next.set('category', id);
    else next.delete('category');
    next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchDraft('');
    setSearchParams({}, { replace: true });
  };

  const emptyDescription = keyword
    ? `Không tìm thấy sản phẩm cho “${keyword}”`
    : categoryId
      ? 'Chưa có sản phẩm trong danh mục này'
      : 'Chưa có sản phẩm nào';

  return (
    <PageContainer className="products-page">
      <header className="products-hero">
        <Breadcrumb
          className="products-hero__breadcrumb"
          items={[
            {
              title: (
                <Link to="/user">
                  <HomeOutlined /> Trang chủ
                </Link>
              ),
            },
            { title: 'Sản phẩm' },
          ]}
        />
        <div className="products-hero__body">
          <div className="products-hero__text">
            <span className="products-hero__eyebrow">
              <AppstoreOutlined aria-hidden /> Cửa hàng
            </span>
            <h1 className="products-hero__title">{pageTitle}</h1>
            <p className="products-hero__subtitle">{pageSubtitle}</p>
          </div>
          {!loading && total > 0 && (
            <div className="products-hero__stat" aria-label={`${total} sản phẩm`}>
              <strong>{total}</strong>
              <span>sản phẩm</span>
            </div>
          )}
        </div>
      </header>

      <div className="products-layout">
        <aside className="products-sidebar" aria-label="Danh mục">
          <div className="products-sidebar__card">
            <h2 className="products-sidebar__title">
              <BiFilterAlt aria-hidden /> Danh mục
            </h2>
            <nav className="products-sidebar__nav">
              <button
                type="button"
                className={`products-sidebar__item${!categoryId ? ' products-sidebar__item--active' : ''}`}
                onClick={() => selectCategory(null)}
              >
                Tất cả sản phẩm
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`products-sidebar__item${categoryId === cat.id ? ' products-sidebar__item--active' : ''}`}
                  onClick={() => selectCategory(cat.id)}
                >
                  {cat.imageUrl && (
                    <img src={cat.imageUrl} alt="" className="products-sidebar__thumb" />
                  )}
                  <span>{cat.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="products-main">
          <div className="products-toolbar">
            <Input
              className="products-toolbar__search"
              size="large"
              placeholder="Tìm tên sản phẩm..."
              prefix={<SearchOutlined className="products-toolbar__search-icon" />}
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onPressEnter={applySearch}
              allowClear
            />
            <Button type="primary" size="large" icon={<SearchOutlined />} onClick={applySearch}>
              Tìm kiếm
            </Button>
            <Select
              className="products-toolbar__sort"
              size="large"
              value={sort}
              onChange={(v) => setSort(v as SortKey)}
              options={[
                { value: 'newest', label: 'Mới nhất' },
                { value: 'price-asc', label: 'Giá thấp → cao' },
                { value: 'price-desc', label: 'Giá cao → thấp' },
              ]}
            />
          </div>

          {categories.length > 0 && (
            <div className="products-chips" aria-label="Lọc nhanh danh mục">
              <button
                type="button"
                className={`products-chips__chip${!categoryId ? ' products-chips__chip--active' : ''}`}
                onClick={() => selectCategory(null)}
              >
                Tất cả
              </button>
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`products-chips__chip${categoryId === cat.id ? ' products-chips__chip--active' : ''}`}
                  onClick={() => selectCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {hasFilters && (
            <div className="products-active-filters">
              {keyword && (
                <span className="products-filter-tag">
                  Từ khóa: <strong>{keyword}</strong>
                </span>
              )}
              {categoryId && activeCategoryName && (
                <span className="products-filter-tag">
                  Danh mục: <strong>{activeCategoryName}</strong>
                </span>
              )}
              <button type="button" className="products-filter-clear" onClick={clearFilters}>
                <CloseCircleOutlined /> Xóa bộ lọc
              </button>
            </div>
          )}

          <section className="products-panel" aria-live="polite">
            {loading ? (
              <div className="products-skeleton-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="products-skeleton-card">
                    <Skeleton.Image active className="products-skeleton-card__img" />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="products-panel__empty">
                <EmptyState
                  description={emptyDescription}
                  actionLabel="Xem tất cả sản phẩm"
                  onAction={clearFilters}
                />
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {sortedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="products-grid__item"
                      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
                    >
                      <ProductCard
                        product={product}
                        onClick={(id) => navigate(`/user/products/${id}`)}
                      />
                    </div>
                  ))}
                </div>
                {total > PAGE_SIZE && (
                  <footer className="products-panel__footer">
                    <Pagination
                      current={pageFromUrl}
                      pageSize={PAGE_SIZE}
                      total={total}
                      showSizeChanger={false}
                      showTotal={(t, range) => `${range[0]}–${range[1]} / ${t} sản phẩm`}
                      onChange={setPage}
                    />
                  </footer>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default ProductsPage;
