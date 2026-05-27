import { memo } from 'react';
import { StarFilled } from '@ant-design/icons';
import '../../css/ProductCard.css';

export interface ProductCardData {
  id: string;
  productName: string;
  thumbnail: string;
  price: number;
  oldPrice?: number;
  discountText?: string;
  variants?: { price: number }[];
}

interface ProductCardProps {
  product: ProductCardData;
  onClick: (id: string) => void;
}

function hashSold(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 10000;
  return 50 + (h % 950);
}

function hashRating(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i);
  return (4 + (h % 10) / 10).toFixed(1);
}

function ProductCard({ product, onClick }: ProductCardProps) {
  const prices = product.variants?.map((v) => v.price) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.price;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price;

  const discountPct =
    product.oldPrice && product.oldPrice > minPrice
      ? Math.round((1 - minPrice / product.oldPrice) * 100)
      : null;

  const sold = hashSold(product.id);
  const rating = hashRating(product.id);

  return (
    <article
      className="product-card"
      onClick={() => onClick(product.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(product.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Xem ${product.productName}`}
    >
      <div className="product-card__image-wrap">
        {discountPct !== null && discountPct > 0 && (
          <span className="product-card__badge">-{discountPct}%</span>
        )}
        {product.discountText && !discountPct && (
          <span className="product-card__badge product-card__badge--hot">HOT</span>
        )}
        <img
          src={product.thumbnail}
          alt={product.productName}
          loading="lazy"
          className="product-card__image"
        />
      </div>
      <div className="product-card__body">
        <h3 className="product-name">{product.productName}</h3>
        <div className="product-card__meta">
          <span className="product-card__rating">
            <StarFilled aria-hidden />
            {rating}
          </span>
          <span className="product-card__sold">Đã bán {sold}</span>
        </div>
        <div className="product-card__price-row">
          <span className="product-price">
            {minPrice === maxPrice
              ? `₫${minPrice.toLocaleString('vi-VN')}`
              : `₫${minPrice.toLocaleString('vi-VN')} - ₫${maxPrice.toLocaleString('vi-VN')}`}
          </span>
          {product.oldPrice && (
            <span className="product-old-price">
              ₫{product.oldPrice.toLocaleString('vi-VN')}
            </span>
          )}
        </div>
        {product.discountText && (
          <span className="product-discount">{product.discountText}</span>
        )}
      </div>
    </article>
  );
}

export default memo(ProductCard);
