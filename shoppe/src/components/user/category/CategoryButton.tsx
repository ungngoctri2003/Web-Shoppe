import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../../api/category/category.api';
import '../../../css/components/CategoryButton.css';

function CategoryButton() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res: any = await getAllCategories({
          pageInfo: { page: 1, pageSize: 16 },
          keyWord: '',
          filter: {},
          sorts: {},
        });
        if (res.success && Array.isArray(res.data)) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi khi tải danh mục', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/user/products?category=${categoryId}`);
  };

  const renderItem = (category: any) => (
    <button
      key={category.id}
      type="button"
      className="category-item"
      onClick={() => handleCategoryClick(category.id)}
      aria-label={`Danh mục ${category.name}`}
    >
      {category.imageUrl && (
        <div className="category-item__icon">
          <img src={category.imageUrl} alt="" loading="lazy" />
        </div>
      )}
      <span className="category-item__label">{category.name}</span>
    </button>
  );

  const items = data.slice(0, 16);

  return (
    <section className="category-section" aria-labelledby="category-heading">
      <div className="category-section__header">
        <h2 id="category-heading" className="category-section__title">
          Danh mục nổi bật
        </h2>
        <button
          type="button"
          className="category-section__more"
          onClick={() => navigate('/user/products?keyword=')}
        >
          Xem tất cả →
        </button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <div className="category-scroll" role="list">
            {items.map(renderItem)}
          </div>
          <div className="category-grid" role="list">
            {items.map(renderItem)}
          </div>
        </>
      )}
    </section>
  );
}

export default CategoryButton;
