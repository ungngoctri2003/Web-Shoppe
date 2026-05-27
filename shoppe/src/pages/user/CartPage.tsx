import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Checkbox,
    InputNumber,
    Typography,
    Card,
    Button,
    message,
} from "antd";
import { ArrowLeftOutlined, BarcodeOutlined, RightOutlined, ShopOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getCartState, setCart } from "../../features/slices/cart.slice";
import {
    getUserCartItems,
    removeCartItem,
    updateCartItem,
} from "../../api/cartitem/cartitem.api";
import LoadingDefault from "../../components/loading/LoadingDefault";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import CheckoutSteps from "../../components/ui/CheckoutSteps";
import "../../css/pages/CartPage.css";
import EmptyState from '../../components/ui/EmptyState';
import VoucherModal from "./VoucherModal";
import { showError, showSuccess, showWarning } from "../../untils/ShowToast";

const { Text } = Typography;

function CartPage() {
    const dispatch = useDispatch();
    const { data } = useSelector(getCartState);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [isVoucherModalVisible, setVoucherModalVisible] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const body = { pageInfo: { page: 1, pageSize: 20 }, keyWord: "" };
            const res: any = await getUserCartItems(body);
            dispatch(
                setCart({
                    data: res?.data,
                    totalRecord: res?.totalRecord || 0,
                    totalCartItem: res?.totalCartItem || 0,
                })
            );
        } catch (err) {
            console.error("Lỗi khi load giỏ hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        const subtotal = selectedItems.reduce(
            (sum, item) =>
                sum + ((item.productVariant?.price ?? item.price) * item.quantity),
            0
        );
        setCartTotal(subtotal);

        if (appliedVoucher) {
            let discount = 0;
            if (appliedVoucher.discountPercent) {
                discount = (subtotal * appliedVoucher.discountPercent) / 100;
            } else if (appliedVoucher.minOrderValue && subtotal >= appliedVoucher.minOrderValue) {
                discount = appliedVoucher.discountAmount || 0;
            }
            setAppliedVoucher((prev: any) => ({ ...prev, discount }));
        }
    }, [selectedItems]);

    const handleToggleItem = (item: any, checked: boolean) => {
        setSelectedItems((prev) =>
            checked ? [...prev, item] : prev.filter((i) => i.id !== item.id)
        );
    };

    const handleQuantityChange = async (
        productId: string,
        productVariantId: string | null,
        quantity: number
    ) => {
        try {
            await updateCartItem({ productId, productVariantId, quantity });
            fetchCart();
            setSelectedItems((prev) =>
                prev.map((item) =>
                    item.productId === productId &&
                        (item.productVariantId ?? null) === (productVariantId ?? null)
                        ? { ...item, quantity }
                        : item
                )
            );
        } catch (err) {
            console.error("Update thất bại:", err);
        }
    };

    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            const allItems = data.flatMap((seller: any) => seller.items);
            setSelectedItems(allItems);
        } else {
            setSelectedItems([]);
        }
    };

    const isAllSelected =
        data?.length > 0 &&
        selectedItems.length > 0 &&
        data.every((seller: any) =>
            seller.items.every((item: any) =>
                selectedItems.some((sel) => sel.id === item.id)
            )
        );

    const isIndeterminate = selectedItems.length > 0 && !isAllSelected;

    const handleApplyVoucher = (voucher: any) => {
        if (!voucher) {
            setAppliedVoucher(null);
            message.info("Voucher đã được bỏ chọn.");
            return;
        }
        let discount = 0;
        if (voucher.discountPercent) {
            discount = (cartTotal * voucher.discountPercent) / 100;
        } else if (voucher.minOrderValue && cartTotal >= voucher.minOrderValue) {
            discount = voucher.discountAmount || 0;
        }
        setAppliedVoucher({ ...voucher, discount });
        message.success(`Voucher ${voucher.code} đã được áp dụng!`);
    };

    const finalPrice = useMemo(
        () => Math.max(0, cartTotal - (appliedVoucher?.discount || 0)),
        [cartTotal, appliedVoucher]
    );

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            showWarning("Vui lòng chọn ít nhất 1 sản phẩm để mua");
            return;
        }
        const checkoutItems = selectedItems.map((item) => ({
            ...item,
            price: item.productVariant?.price ?? item.price,
        }));
        navigate("/user/checkout", {
            state: { items: checkoutItems, cartItemIds: checkoutItems.map((i) => i.id), appliedVoucher },
        });
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await removeCartItem(id);
            showSuccess("Đã xoá sản phẩm khỏi giỏ hàng");
            fetchCart();
            setSelectedItems((prev) => prev.filter((item) => item.id !== id));
        } catch {
            showError("Xoá sản phẩm thất bại");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingDefault />;

    if (!data?.length) {
        return (
            <PageContainer>
                <PageHeader
                    title="Giỏ hàng"
                    breadcrumbs={[{ title: 'Trang chủ', href: '/user' }, { title: 'Giỏ hàng' }]}
                />
                <EmptyState
                    description="Giỏ hàng trống"
                    actionLabel="Tiếp tục mua sắm"
                    onAction={() => navigate('/user')}
                />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="cart-page">
                <PageHeader
                    title="Giỏ hàng"
                    breadcrumbs={[{ title: 'Trang chủ', href: '/user' }, { title: 'Giỏ hàng' }]}
                    extra={
                        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/user')}>
                            Quay lại
                        </Button>
                    }
                />
                <CheckoutSteps current={0} />

                <div className="cart-page__layout">
                    <div className="cart-page__items">
                        <Card className="cart-seller-card" styles={{ body: { padding: 0 } }}>
                            <div className="cart-table-header">
                                <div className="cart-table-header__col--product">
                                    <Checkbox
                                        indeterminate={isIndeterminate}
                                        checked={isAllSelected}
                                        onChange={(e) => handleToggleAll(e.target.checked)}
                                    >
                                        Sản phẩm
                                    </Checkbox>
                                </div>
                                <div className="cart-table-header__col">Đơn giá</div>
                                <div className="cart-table-header__col">Số lượng</div>
                                <div className="cart-table-header__col">Thành tiền</div>
                                <div className="cart-table-header__col">Thao tác</div>
                            </div>

                            {data.map((itemsCart: any) => (
                                <div key={itemsCart.sellerId} style={{ padding: '0 var(--space-4)' }}>
                                    <div className="cart-seller-card__header">
                                        <ShopOutlined />
                                        <span>{itemsCart.sellerName}</span>
                                    </div>
                                    {itemsCart.items?.map((item: any) => {
                                        const unitPrice = item?.productVariant?.price ?? item.price;
                                        const lineTotal = unitPrice * item.quantity;
                                        return (
                                            <div key={item.id} className="cart-item-row">
                                                <div className="cart-item-row__check">
                                                    <Checkbox
                                                        checked={selectedItems.some((i) => i.id === item.id)}
                                                        onChange={(e) => handleToggleItem(item, e.target.checked)}
                                                    />
                                                </div>
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.productName}
                                                    className="cart-item-row__thumb"
                                                    loading="lazy"
                                                />
                                                <div className="cart-item-row__info">
                                                    <Link to={`/user/products/${item.productId}`} className="cart-item-row__name">
                                                        {item.productName}
                                                    </Link>
                                                    {item.productVariant && (
                                                        <div className="cart-item-row__variant">
                                                            {item.productVariant.variantName}: {item.productVariant.variantValue}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="cart-item-row__price">
                                                    <span className="cart-item-row__label">Đơn giá</span>
                                                    {unitPrice.toLocaleString('vi-VN')} đ
                                                </div>
                                                <div className="cart-item-row__qty">
                                                    <span className="cart-item-row__label">Số lượng</span>
                                                    <InputNumber
                                                        min={1}
                                                        max={item.stockQuantity}
                                                        value={item.quantity}
                                                        size="small"
                                                        onChange={(value) =>
                                                            handleQuantityChange(item.productId, item.productVariantId ?? null, value || 1)
                                                        }
                                                    />
                                                </div>
                                                <div className="cart-item-row__total">
                                                    <span className="cart-item-row__label">Thành tiền</span>
                                                    <strong>{lineTotal.toLocaleString('vi-VN')} đ</strong>
                                                </div>
                                                <div className="cart-item-row__actions">
                                                    <Button type="link" danger size="small" onClick={() => handleDelete(item.id)}>
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </Card>
                    </div>

                    <div className="cart-page__summary">
                        <Card className="cart-summary-card">
                            <div
                                className="cart-summary-card__voucher"
                                onClick={() => setVoucherModalVisible(true)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setVoucherModalVisible(true)}
                            >
                                <BarcodeOutlined style={{ fontSize: 20, color: 'var(--color-primary-500)' }} />
                                <div style={{ flex: 1 }}>
                                    <Text strong>Voucher giảm giá</Text>
                                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                                        Chọn hoặc nhập mã
                                    </div>
                                </div>
                                <RightOutlined />
                            </div>

                            {appliedVoucher && (
                                <div className="cart-voucher-tag">
                                    <BarcodeOutlined />
                                    {appliedVoucher.code || `Giảm ${appliedVoucher.discountPercent}%`}
                                </div>
                            )}

                            <div className="cart-summary-card__line">
                                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                                <span>{cartTotal.toLocaleString('vi-VN')} đ</span>
                            </div>
                            {appliedVoucher?.discount > 0 && (
                                <div className="cart-summary-card__line">
                                    <span>Giảm giá</span>
                                    <span style={{ color: 'var(--color-success-500)' }}>
                                        -{appliedVoucher.discount.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                            )}
                            <div className="cart-summary-card__total">
                                <span>Tổng cộng</span>
                                <span className="cart-summary-card__total-amount">
                                    {finalPrice.toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                className="cart-summary-card__checkout-btn cart-summary-card__checkout-btn--desktop"
                                onClick={handleCheckout}
                            >
                                Mua hàng ({selectedItems.length})
                            </Button>
                        </Card>
                    </div>
                </div>

                <div className="cart-page__mobile-bar">
                    <div>
                        <Text strong style={{ fontSize: 18, color: 'var(--color-primary-500)' }}>
                            {finalPrice.toLocaleString('vi-VN')} đ
                        </Text>
                        <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                            {selectedItems.length} sản phẩm đã chọn
                        </Text>
                    </div>
                    <Button type="primary" size="large" onClick={handleCheckout}>
                        Mua hàng
                    </Button>
                </div>

                <VoucherModal
                    visible={isVoucherModalVisible}
                    onClose={() => setVoucherModalVisible(false)}
                    onApply={handleApplyVoucher}
                    cartTotal={cartTotal}
                />
            </div>
        </PageContainer>
    );
}

export default CartPage;
