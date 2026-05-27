import { Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProduct } from '../api/product/product.api';
import '../css/components/ShopeeSearch.css';

const MIN_SEARCH_LENGTH = 2;

interface SearchProduct {
  id: string;
  thumbnail: string;
  productName: string;
  price: number;
  isActive?: boolean;
  sellerStatus?: boolean;
}

const ShopeeSearch = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    const trimmed = searchText.trim();
    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current = false;

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getAllProduct({
          pageInfo: { page: 1, pageSize: 20 },
          keyWord: trimmed,
        });
        if (abortRef.current) return;
        const data = (res as { data?: SearchProduct[] })?.data ?? [];
        const activeProducts = data.filter(
          (p) => p.isActive !== false && p.sellerStatus !== false
        );
        setResults(activeProducts);
      } catch {
        if (!abortRef.current) setResults([]);
      } finally {
        if (!abortRef.current) setLoading(false);
      }
    }, 300);

    return () => {
      abortRef.current = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText]);

  const handleSelect = (prodId: string) => {
    navigate(`/user/products/${prodId}`);
    setSearchText('');
    setResults([]);
  };

  const handleSearch = () => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
    navigate(`/user/products?keyword=${encodeURIComponent(trimmed)}`);
    setSearchText('');
    setResults([]);
  };

  const showDropdown = searchText.trim().length >= MIN_SEARCH_LENGTH;

  return (
    <div className="shopee-search" role="search">
      <div className="shopee-search__bar">
        <Input
          className="shopee-search__input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Tìm kiếm trong Shop"
          allowClear
          bordered={false}
          aria-label="Tìm kiếm sản phẩm"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <button
          type="button"
          className="shopee-search__submit"
          onClick={handleSearch}
          aria-label="Tìm kiếm"
        >
          <SearchOutlined />
        </button>
      </div>

      {showDropdown && (
        <ul
          className="shopee-search__dropdown"
          role="listbox"
          aria-label="Kết quả tìm kiếm"
        >
          {loading && (
            <li className="shopee-search__status" role="status">
              <Spin size="small" /> Đang tìm...
            </li>
          )}
          {!loading &&
            results.length > 0 &&
            results.map((prod) => (
              <li key={prod.id} role="option">
                <button
                  type="button"
                  className="shopee-search__item"
                  onClick={() => handleSelect(prod.id)}
                >
                  <img
                    src={prod.thumbnail}
                    alt=""
                    loading="lazy"
                    className="shopee-search__thumb"
                  />
                  <span className="shopee-search__info">
                    <span className="shopee-search__name">{prod.productName}</span>
                    <span className="shopee-search__price">
                      ₫{prod.price.toLocaleString('vi-VN')}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          {!loading && results.length === 0 && (
            <li className="shopee-search__status">Không tìm thấy sản phẩm</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default memo(ShopeeSearch);
