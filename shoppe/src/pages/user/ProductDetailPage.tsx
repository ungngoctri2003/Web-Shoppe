import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Input,
  Image,
  Typography,
  Divider,
  Avatar,
  Radio,
  Skeleton,
  Space,
} from 'antd';
import { ArrowLeftOutlined, ShopFilled, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailProduct } from '../../api/product/product.api';
import { createCartItem } from '../../api/cartitem/cartitem.api';
import { getTokenState } from '../../features/slices/app.slice';
import InfoRowDetail from './components/InfoRowDetail';
import PageContainer from '../../components/ui/PageContainer';
import '../../css/pages/ProductDetail.css';
import { setCart } from '../../features/slices/cart.slice';
import { showError, showSuccess, showWarning } from '../../untils/ShowToast';
import {
  addGuestCartItem,
  buildCartStateFromGuest,
  buildGuestCartItemFromProduct,
} from '../../services/guestCart';
import { normalizeCartApiResponse } from '../../services/cartNormalize';
import { fetchServerCart } from '../../services/cartSync';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>('');

  const tokenFromStore = useSelector(getTokenState);
  const token = tokenFromStore || localStorage.getItem('access_token');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProductDetail = async (productId: string) => {
    setLoading(true);
    setError('');
    try {
      const res: any = await getDetailProduct(productId);
      if (res?.success) {
        const data = res.data;
        setProduct(data);
        setMainImage(data.thumbnail || data.productImages?.[0]);
        if (data?.productVariants?.length) {
          setSelectedVariantId(data.productVariants[0].id);
        }
      } else {
        setError('Không tìm thấy sản phẩm');
      }
    } catch {
      setError('Lỗi khi tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductDetail(id);
  }, [id]);

  const selectedVariant = product?.productVariants?.find((v: any) => v.id === selectedVariantId);

  const handleChangeQuantity = (value: number) => {
    const stockLimit = selectedVariant?.stockQuantity ?? product?.stockQuantity ?? 1;
    setQuantity(Math.max(1, Math.min(value, stockLimit)));
  };

  const increaseQuantity = () => handleChangeQuantity(quantity + 1);
  const decreaseQuantity = () => handleChangeQuantity(quantity - 1);

  const handleAddToCart = async () => {
    const hasVariants = !!product?.productVariants?.length;
    if ((hasVariants && !selectedVariantId) || quantity <= 0) {
      showWarning('Vui lòng chọn phân loại và số lượng hợp lệ');
      return;
    }

    const variant = hasVariants
      ? product.productVariants.find((v: any) => v.id === selectedVariantId)
      : null;

    if (!token) {
      addGuestCartItem(buildGuestCartItemFromProduct(product, variant, quantity));
      dispatch(setCart(buildCartStateFromGuest()));
      showSuccess('Đã thêm vào giỏ hàng!');
      return;
    }

    try {
      const payload = {
        productId: product.id,
        productName: product.productName,
        sellerName: product.sellerName,
        thumbnail: product.thumbnail,
        productImages: product.productImages,
        categoryName: product.categoryName,
        productVariantId: variant ? variant.id : null,
        variantName: variant ? `${variant.color} - ${variant.size}` : null,
        variantPrice: variant ? variant.price : product.price,
        variantImage: variant ? variant.imageUrl : null,
        stockQuantity: variant ? variant.stockQuantity : product.stockQuantity,
        price: variant ? variant.price : product.price,
        quantity,
      };

      const res: any = await createCartItem(payload);
      if (res?.success ?? res?.data) {
        dispatch(setCart(normalizeCartApiResponse(res)));
        showSuccess('Đã thêm vào giỏ hàng!');
      } else {
        await fetchServerCart(dispatch);
        showSuccess('Đã thêm vào giỏ hàng!');
      }
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleBuyNow = async () => {
    const hasVariants = !!product?.productVariants?.length;
    if ((hasVariants && !selectedVariantId) || quantity <= 0) {
      showWarning('Vui lòng chọn phân loại và số lượng hợp lệ');
      return;
    }

    const variant = hasVariants
      ? product.productVariants.find((v: any) => v.id === selectedVariantId)
      : null;

    if (!token) {
      addGuestCartItem(buildGuestCartItemFromProduct(product, variant, quantity));
      dispatch(setCart(buildCartStateFromGuest()));
      navigate('/user/cart');
      return;
    }

    const selectedItem = {
      id: product.id,
      productId: product.id,
      productName: product.productName,
      sellerName: product.sellerName,
      thumbnail: product.thumbnail,
      productImages: product.productImages,
      categoryName: product.categoryName,
      productVariantId: variant ? variant.id : null,
      variantName: variant ? `${variant.color} - ${variant.size}` : null,
      variantPrice: variant ? variant.price : product.price,
      variantImage: variant ? variant.imageUrl : null,
      stockQuantity: variant ? variant.stockQuantity : product.stockQuantity,
      price: variant ? variant.price : product.price,
      quantity,
    };

    navigate('/user/checkout', { state: { items: [selectedItem] } });
  };

  if (loading) {
    return (
      <PageContainer className="pdp-page">
        <Skeleton active paragraph={{ rows: 8 }} />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer className="pdp-page">
        <Alert
          message={error}
          type="error"
          showIcon
          action={
            <Button type="link" onClick={() => navigate('/user')}>
              Về trang chủ
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const stockMax =
    selectedVariant?.stockQuantity ?? product?.stockQuantity ?? 1;

  return (
    <PageContainer className="pdp-page">
      <div className="pdp">
        <div className="pdp__back">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="pdp__back-btn"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </div>

        <div className="pdp__layout">
          <div className="pdp__gallery">
            <img
              src={mainImage || selectedVariant?.imageUrl || product.thumbnail}
              alt={product.productName}
              className="pdp__main-image"
            />

            {product?.productImages?.length > 0 && (
              <div className="pdp__thumbs">
                {product.productImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    className={`pdp__thumb ${img === mainImage ? 'pdp__thumb--active' : ''}`}
                    onClick={() => setMainImage(img)}
                    aria-label={`Ảnh ${index + 1}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pdp__info">
            <Title level={3} className="pdp__title">
              {product.productName}
            </Title>

            <div className="pdp__price">
              {(selectedVariant?.price ?? product?.price)?.toLocaleString('vi-VN')}đ
            </div>

            {product?.productVariants?.length > 0 && (
              <div className="pdp__field pdp__variants">
                <div className="pdp__field-label">Phân loại hàng</div>
                <Radio.Group
                  value={selectedVariantId}
                  onChange={(e) => {
                    const variantId = e.target.value;
                    setSelectedVariantId(variantId);
                    setQuantity(1);
                    const v = product.productVariants.find((x: any) => x.id === variantId);
                    if (v?.imageUrl) setMainImage(v.imageUrl);
                  }}
                >
                  {product.productVariants.map((v: any) => (
                    <Radio.Button
                      key={v.id}
                      value={v.id}
                      className="pdp__variant-btn"
                    >
                      <span className="pdp__variant-label">
                        {v.imageUrl && (
                          <Image
                            className="pdp__variant-img"
                            src={v.imageUrl}
                            preview={false}
                            alt=""
                          />
                        )}
                        {v.variantValue}
                      </span>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )}

            <div className="pdp__field">
              <div className="pdp__field-label">Số lượng</div>
              <Space.Compact>
                <Button onClick={decreaseQuantity} disabled={quantity <= 1}>
                  -
                </Button>
                <Input
                  className="pdp__qty-input"
                  value={quantity}
                  onChange={(e) => handleChangeQuantity(Number(e.target.value))}
                />
                <Button onClick={increaseQuantity} disabled={quantity >= stockMax}>
                  +
                </Button>
              </Space.Compact>
            </div>

            <div className="pdp__desktop-actions">
              <Button icon={<ShoppingCartOutlined />} size="large" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </Button>
              <Button type="primary" size="large" onClick={handleBuyNow}>
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pdp__sticky-bar" role="group" aria-label="Mua hàng nhanh">
        <Button block size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
          Giỏ hàng
        </Button>
        <Button type="primary" block size="large" onClick={handleBuyNow}>
          Mua ngay
        </Button>
      </div>

      <section className="pdp__section" aria-label="Thông tin shop">
        <div className="pdp__shop">
          <div className="pdp__shop-info">
            {product?.avatar ? (
              <img src={product.avatar} alt="" className="pdp__shop-avatar" />
            ) : (
              <Avatar
                size={80}
                icon={<UserOutlined />}
                className="pdp__shop-avatar--placeholder"
              />
            )}
            <div>
              <div className="pdp__shop-name">{product?.sellerName}</div>
              <Text type="secondary">Người bán uy tín</Text>
            </div>
          </div>
          <Button
            className="pdp__shop-btn"
            onClick={() => navigate(`/user/shop/${product?.sellerId}`)}
          >
            <ShopFilled className="pdp__shop-btn-icon" />
            <span>Xem shop</span>
          </Button>
        </div>
      </section>

      <section className="pdp__section" aria-labelledby="pdp-specs-title">
        <Title level={5} id="pdp-specs-title" className="pdp__section-title">
          Chi tiết sản phẩm
        </Title>
        <Divider className="pdp__section-divider" />
        <InfoRowDetail
          label="Danh mục"
          value={
            <span>
              {product?.sellerName} &gt; {product?.categoryName} &gt; {product?.productName}
            </span>
          }
        />
        <InfoRowDetail
          label="Kho"
          value={product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
        />
        <InfoRowDetail label="Trạng thái" value={product.status?.toUpperCase()} />
        <InfoRowDetail
          label="Phân loại"
          value={
            product.productVariants?.length
              ? `${product.productVariants.length} biến thể`
              : 'Không có'
          }
        />
        <InfoRowDetail
          label="Giá niêm yết"
          value={`${product.price?.toLocaleString('vi-VN')}₫`}
        />
      </section>

      <section className="pdp__section" aria-labelledby="pdp-desc-title">
        <Title level={5} id="pdp-desc-title" className="pdp__section-title">
          Mô tả sản phẩm
        </Title>
        <Divider className="pdp__section-divider" />
        {product?.description ? (
          <Paragraph className="pdp__description">{product.description}</Paragraph>
        ) : (
          <Text type="secondary">Chưa có mô tả cho sản phẩm này.</Text>
        )}
      </section>
    </PageContainer>
  );
};

export default ProductDetailPage;
