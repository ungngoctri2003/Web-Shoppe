import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Button, Popconfirm } from "antd";
import {
    BarcodeOutlined,
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
    RightOutlined,
    SafetyCertificateOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    TruckOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getCartState, setCart } from "../../features/slices/cart.slice";
import {
    removeCartItem,
    updateCartItem,
    toggleCartItemSelection,
} from "../../api/cartitem/cartitem.api";
import LoadingDefault from "../../components/loading/LoadingDefault";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import CheckoutSteps from "../../components/ui/CheckoutSteps";
import "../../css/pages/CartPage.css";
import EmptyState from '../../components/ui/EmptyState';
import VoucherModal from "./VoucherModal";
import { showError, showInfo, showSuccess, showWarning } from "../../untils/ShowToast";
import { getTokenState, getRoleIdState } from "../../features/slices/app.slice";
import { ROLE } from "../../constants";
import {
    buildCartStateFromGuest,
    removeGuestCartItem,
    syncGuestCartToRedux,
    updateGuestCartQuantity,
} from "../../services/guestCart";
import { fetchServerCart } from "../../services/cartSync";
import {
    getCartLineUnitPrice,
    getSelectedCartItems,
    toCheckoutOrderItem,
} from "../../services/cartNormalize";
import type { ICartItem } from "../../untils/types/TypeCartItem";
import { goToLogin } from "../../untils/loginRedirect";

type AppliedVoucher = {
    code: string;
    discountPercent?: number;
    minOrderValue?: number;
    discountAmount?: number;
};

function formatPrice(value: number) {
    return `${value.toLocaleString('vi-VN')}đ`;
}

function CartPage() {
    const dispatch = useDispatch();
    const { data, totalCartItem } = useSelector(getCartState);
    const tokenFromStore = useSelector(getTokenState);
    const token = tokenFromStore || localStorage.getItem('access_token');
    const roleId = useSelector(getRoleIdState);

    const authReady = !token || roleId != null;
    const isGuestCart = !token || (roleId != null && roleId !== ROLE.USER);

    const [initialLoading, setInitialLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();
    const [isVoucherModalVisible, setVoucherModalVisible] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
    const [selectedItems, setSelectedItems] = useState<ICartItem[]>([]);
    const selectionInitialized = useRef(false);

    const allItems = useMemo(
        () => data.flatMap((seller) => seller.items ?? []),
        [data]
    );

    const fetchCart = useCallback(async (options?: { silent?: boolean }) => {
        try {
            if (!options?.silent) setInitialLoading(true);
            if (isGuestCart) {
                syncGuestCartToRedux(dispatch);
            } else {
                await fetchServerCart(dispatch);
            }
        } catch (err) {
            console.error("Lỗi khi load giỏ hàng:", err);
            showError("Không thể tải giỏ hàng");
        } finally {
            if (!options?.silent) setInitialLoading(false);
        }
    }, [dispatch, isGuestCart]);

    useEffect(() => {
        if (!authReady) return;
        fetchCart();
    }, [authReady, isGuestCart, fetchCart]);

    useEffect(() => {
        if (!initialLoading && allItems.length > 0 && !selectionInitialized.current) {
            const fromServer = getSelectedCartItems(data);
            setSelectedItems(fromServer.length > 0 ? fromServer : allItems);
            selectionInitialized.current = true;
        }
        if (!initialLoading && allItems.length === 0) {
            selectionInitialized.current = false;
        }
    }, [data, initialLoading, allItems]);

    const cartTotal = useMemo(
        () =>
            selectedItems.reduce(
                (sum, item) => sum + getCartLineUnitPrice(item) * item.quantity,
                0
            ),
        [selectedItems]
    );

    const voucherDiscount = useMemo(() => {
        if (!appliedVoucher) return 0;
        if (appliedVoucher.discountPercent) {
            return (cartTotal * appliedVoucher.discountPercent) / 100;
        }
        if (
            appliedVoucher.minOrderValue != null &&
            cartTotal >= appliedVoucher.minOrderValue
        ) {
            return appliedVoucher.discountAmount || 0;
        }
        return 0;
    }, [cartTotal, appliedVoucher]);

    const finalPrice = useMemo(
        () => Math.max(0, cartTotal - voucherDiscount),
        [cartTotal, voucherDiscount]
    );

    const isItemSelected = (id: string) => selectedItems.some((i) => i.id === id);

    const handleToggleItem = async (item: ICartItem, checked: boolean) => {
        setSelectedItems((prev) =>
            checked ? [...prev, item] : prev.filter((i) => i.id !== item.id)
        );

        if (!isGuestCart) {
            try {
                await toggleCartItemSelection(
                    item.productId,
                    checked,
                    item.productVariantId ?? null
                );
            } catch {
                showError("Không thể cập nhật lựa chọn sản phẩm");
                await fetchCart({ silent: true });
            }
        }
    };

    const handleQuantityChange = async (
        productId: string,
        productVariantId: string | null,
        quantity: number
    ) => {
        const qty = Math.max(1, quantity);
        try {
            setActionLoading(true);
            if (isGuestCart) {
                updateGuestCartQuantity(productId, productVariantId, qty);
                dispatch(setCart(buildCartStateFromGuest()));
            } else {
                await updateCartItem({ productId, productVariantId, quantity: qty });
                await fetchCart({ silent: true });
            }
            setSelectedItems((prev) =>
                prev.map((item) =>
                    item.productId === productId &&
                    (item.productVariantId ?? null) === (productVariantId ?? null)
                        ? { ...item, quantity: qty }
                        : item
                )
            );
        } catch {
            showError("Cập nhật số lượng thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleAll = (checked: boolean) => {
        setSelectedItems(checked ? allItems : []);
    };

    const isAllSelected =
        allItems.length > 0 &&
        selectedItems.length > 0 &&
        allItems.every((item) => isItemSelected(item.id));

    const isIndeterminate = selectedItems.length > 0 && !isAllSelected;

    const handleApplyVoucher = (voucher: AppliedVoucher | null) => {
        if (!voucher) {
            setAppliedVoucher(null);
            showInfo("Voucher đã được bỏ chọn.");
            return;
        }
        if (
            voucher.minOrderValue != null &&
            cartTotal < voucher.minOrderValue
        ) {
            showWarning(`Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}đ để dùng mã này`);
            return;
        }
        setAppliedVoucher(voucher);
        showSuccess(`Voucher ${voucher.code} đã được áp dụng!`);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            showWarning("Vui lòng chọn ít nhất 1 sản phẩm để mua");
            return;
        }
        if (isGuestCart) {
            showWarning("Vui lòng đăng nhập để thanh toán");
            goToLogin(navigate, "/user/cart");
            return;
        }
        const checkoutItems = selectedItems.map(toCheckoutOrderItem);
        const voucherPayload = appliedVoucher
            ? { ...appliedVoucher, discount: voucherDiscount }
            : null;

        navigate("/user/checkout", {
            state: {
                items: checkoutItems,
                cartItemIds: selectedItems.map((i) => i.id),
                appliedVoucher: voucherPayload,
            },
        });
    };

    const handleDelete = async (id: string) => {
        try {
            setActionLoading(true);
            if (isGuestCart) {
                removeGuestCartItem(id);
                dispatch(setCart(buildCartStateFromGuest()));
            } else {
                await removeCartItem(id);
                await fetchCart({ silent: true });
            }
            showSuccess("Đã xoá sản phẩm khỏi giỏ hàng");
            setSelectedItems((prev) => prev.filter((item) => item.id !== id));
        } catch {
            showError("Xoá sản phẩm thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) {
            showWarning("Chọn sản phẩm cần xóa");
            return;
        }
        try {
            setActionLoading(true);
            if (isGuestCart) {
                for (const item of selectedItems) {
                    removeGuestCartItem(item.id);
                }
                dispatch(setCart(buildCartStateFromGuest()));
            } else {
                await Promise.all(selectedItems.map((item) => removeCartItem(item.id)));
                await fetchCart({ silent: true });
            }
            showSuccess(`Đã xóa ${selectedItems.length} sản phẩm`);
            setSelectedItems([]);
        } catch {
            showError("Xóa sản phẩm đã chọn thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    const openVoucherModal = () => {
        if (isGuestCart) {
            showWarning('Vui lòng đăng nhập để sử dụng voucher');
            return;
        }
        if (selectedItems.length === 0) {
            showWarning('Chọn sản phẩm trước khi áp dụng voucher');
            return;
        }
        setVoucherModalVisible(true);
    };

    const renderSummary = (showDesktopCheckout: boolean) => (
        <aside className="cart-summary">
            <div className="cart-summary__head">
                <h2 className="cart-summary__title">Tóm tắt đơn hàng</h2>
                <p className="cart-summary__subtitle">
                    {totalCartItem} sản phẩm trong giỏ
                </p>
            </div>

            <div className="cart-summary__body">
                <button
                    type="button"
                    className="cart-summary__voucher"
                    onClick={openVoucherModal}
                >
                    <span className="cart-summary__voucher-icon" aria-hidden>
                        <BarcodeOutlined />
                    </span>
                    <span className="cart-summary__voucher-text">
                        <span className="cart-summary__voucher-title">Voucher giảm giá</span>
                        <span className="cart-summary__voucher-hint">Chọn hoặc nhập mã ưu đãi</span>
                    </span>
                    <RightOutlined className="cart-summary__voucher-arrow" aria-hidden />
                </button>

                {appliedVoucher && (
                    <div className="cart-voucher-applied">
                        <BarcodeOutlined />
                        <span>
                            {appliedVoucher.code}
                            {appliedVoucher.discountPercent
                                ? ` · Giảm ${appliedVoucher.discountPercent}%`
                                : ''}
                        </span>
                        <button
                            type="button"
                            className="cart-voucher-applied__remove"
                            onClick={() => handleApplyVoucher(null)}
                        >
                            Bỏ
                        </button>
                    </div>
                )}

                <div className="cart-summary__row">
                    <span>Tạm tính ({selectedItems.length})</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                </div>
                {voucherDiscount > 0 && (
                    <div className="cart-summary__row cart-summary__row--discount">
                        <span>Giảm giá voucher</span>
                        <strong>-{formatPrice(voucherDiscount)}</strong>
                    </div>
                )}
                <div className="cart-summary__divider" />
                <div className="cart-summary__total">
                    <span className="cart-summary__total-label">Tổng thanh toán</span>
                    <span className="cart-summary__total-amount">{formatPrice(finalPrice)}</span>
                </div>

                {showDesktopCheckout && (
                    <Button
                        type="primary"
                        size="large"
                        disabled={selectedItems.length === 0 || actionLoading}
                        className="cart-summary__checkout cart-summary__checkout--desktop"
                        onClick={handleCheckout}
                        icon={<ShoppingCartOutlined />}
                    >
                        {isGuestCart ? 'Đăng nhập để mua' : `Mua hàng (${selectedItems.length})`}
                    </Button>
                )}

                <div className="cart-summary__perks">
                    <div className="cart-summary__perk">
                        <TruckOutlined className="cart-summary__perk-icon" />
                        <span>Giao nhanh</span>
                    </div>
                    <div className="cart-summary__perk">
                        <SafetyCertificateOutlined className="cart-summary__perk-icon" />
                        <span>Chính hãng</span>
                    </div>
                    <div className="cart-summary__perk">
                        <ShoppingCartOutlined className="cart-summary__perk-icon" />
                        <span>Đổi trả 7 ngày</span>
                    </div>
                </div>
            </div>
        </aside>
    );

    if (!authReady || initialLoading) return <LoadingDefault />;

    if (!data?.length || allItems.length === 0) {
        return (
            <PageContainer className="cart-page--empty">
                <PageHeader
                    title="Giỏ hàng"
                    breadcrumbs={[{ title: 'Trang chủ', href: '/user' }, { title: 'Giỏ hàng' }]}
                />
                <div className="cart-page__empty-wrap">
                    <EmptyState
                        description="Giỏ hàng trống"
                        actionLabel="Tiếp tục mua sắm"
                        onAction={() => navigate('/user')}
                    />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="cart-page">
                <PageHeader
                    title="Giỏ hàng"
                    breadcrumbs={[{ title: 'Trang chủ', href: '/user' }, { title: 'Giỏ hàng' }]}
                />

                <div className="cart-page__steps">
                    <CheckoutSteps current={0} />
                </div>

                <div className="cart-page__layout">
                    <div className="cart-page__main">
                        <div className="cart-toolbar">
                            <div className="cart-toolbar__left">
                                <Checkbox
                                    className="cart-toolbar__select-all"
                                    indeterminate={isIndeterminate}
                                    checked={isAllSelected}
                                    onChange={(e) => handleToggleAll(e.target.checked)}
                                    disabled={actionLoading}
                                >
                                    Chọn tất cả
                                </Checkbox>
                                <span className="cart-toolbar__count">
                                    {selectedItems.length}/{allItems.length} đã chọn
                                </span>
                            </div>
                            <Popconfirm
                                title={`Xóa ${selectedItems.length} sản phẩm đã chọn?`}
                                onConfirm={handleDeleteSelected}
                                okText="Xóa"
                                cancelText="Hủy"
                                disabled={selectedItems.length === 0}
                            >
                                <button
                                    type="button"
                                    className="cart-toolbar__delete"
                                    disabled={selectedItems.length === 0 || actionLoading}
                                >
                                    <DeleteOutlined />
                                    Xóa đã chọn
                                </button>
                            </Popconfirm>
                        </div>

                        {data.map((shop) => (
                            <section key={shop.sellerId} className="cart-shop" aria-label={shop.sellerName}>
                                <header className="cart-shop__header">
                                    <span className="cart-shop__icon" aria-hidden>
                                        <ShopOutlined />
                                    </span>
                                    <span className="cart-shop__name">{shop.sellerName}</span>
                                    <span className="cart-shop__badge">
                                        {shop.items?.length ?? 0} SP
                                    </span>
                                </header>

                                <div className="cart-table-head" aria-hidden>
                                    <span />
                                    <span />
                                    <span>Sản phẩm</span>
                                    <span className="cart-table-head__col--center">Đơn giá</span>
                                    <span className="cart-table-head__col--center">Số lượng</span>
                                    <span className="cart-table-head__col--end">Thành tiền</span>
                                    <span />
                                </div>

                                {shop.items?.map((item) => {
                                    const unitPrice = getCartLineUnitPrice(item);
                                    const lineTotal = unitPrice * item.quantity;
                                    const stockMax = item.stockQuantity > 0 ? item.stockQuantity : 99;
                                    const selected = isItemSelected(item.id);

                                    return (
                                        <article
                                            key={item.id}
                                            className={`cart-item${selected ? ' cart-item--selected' : ''}`}
                                        >
                                            <div className="cart-item__check">
                                                <Checkbox
                                                    checked={selected}
                                                    onChange={(e) =>
                                                        handleToggleItem(item, e.target.checked)
                                                    }
                                                    disabled={actionLoading}
                                                    aria-label={`Chọn ${item.productName}`}
                                                />
                                            </div>

                                            <Link
                                                to={`/user/products/${item.productId}`}
                                                className="cart-item__thumb-link"
                                            >
                                                <img
                                                    src={item.thumbnail || '/vite.svg'}
                                                    alt=""
                                                    className="cart-item__thumb"
                                                    loading="lazy"
                                                />
                                            </Link>

                                            <div className="cart-item__info">
                                                <Link
                                                    to={`/user/products/${item.productId}`}
                                                    className="cart-item__name"
                                                >
                                                    {item.productName}
                                                </Link>
                                                {item.productVariant && (
                                                    <span className="cart-item__variant">
                                                        {item.productVariant.variantName}:{' '}
                                                        {item.productVariant.variantValue}
                                                    </span>
                                                )}
                                                <span className="cart-item__mobile-total">
                                                    {formatPrice(lineTotal)}
                                                </span>
                                            </div>

                                            <div className="cart-item__meta">
                                                <div className="cart-item__price-col">
                                                    <span className="cart-item__label">Đơn giá</span>
                                                    <span className="cart-item__price cart-item__price--unit">
                                                        {formatPrice(unitPrice)}
                                                    </span>
                                                </div>

                                                <div className="cart-item__qty-col">
                                                    <span className="cart-item__label">Số lượng</span>
                                                    <div className="cart-qty">
                                                        <button
                                                            type="button"
                                                            className="cart-qty__btn"
                                                            disabled={
                                                                actionLoading || item.quantity <= 1
                                                            }
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.productId,
                                                                    item.productVariantId ?? null,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            aria-label="Giảm số lượng"
                                                        >
                                                            <MinusOutlined />
                                                        </button>
                                                        <span className="cart-qty__value">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="cart-qty__btn"
                                                            disabled={
                                                                actionLoading ||
                                                                item.quantity >= stockMax
                                                            }
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.productId,
                                                                    item.productVariantId ?? null,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            aria-label="Tăng số lượng"
                                                        >
                                                            <PlusOutlined />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="cart-item__total-col">
                                                    <span className="cart-item__label">Thành tiền</span>
                                                    <span className="cart-item__line-total">
                                                        {formatPrice(lineTotal)}
                                                    </span>
                                                </div>

                                                <div className="cart-item__delete-col">
                                                    <button
                                                        type="button"
                                                        className="cart-item__delete"
                                                        disabled={actionLoading}
                                                        onClick={() => handleDelete(item.id)}
                                                        aria-label="Xóa sản phẩm"
                                                    >
                                                        <DeleteOutlined />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </section>
                        ))}
                    </div>

                    <div className="cart-page__aside">
                        {renderSummary(true)}
                    </div>
                </div>

                <footer className="cart-mobile-bar">
                    <label className="cart-mobile-bar__select">
                        <Checkbox
                            indeterminate={isIndeterminate}
                            checked={isAllSelected}
                            onChange={(e) => handleToggleAll(e.target.checked)}
                            disabled={actionLoading}
                        />
                        <span>Tất cả</span>
                    </label>
                    <div className="cart-mobile-bar__price-wrap">
                        <span className="cart-mobile-bar__price">{formatPrice(finalPrice)}</span>
                        <span className="cart-mobile-bar__meta">
                            {selectedItems.length} sản phẩm · Tiết kiệm{' '}
                            {voucherDiscount > 0 ? formatPrice(voucherDiscount) : '0đ'}
                        </span>
                    </div>
                    <Button
                        type="primary"
                        className="cart-mobile-bar__btn"
                        disabled={selectedItems.length === 0 || actionLoading}
                        onClick={handleCheckout}
                    >
                        {isGuestCart ? 'Đăng nhập' : 'Mua hàng'}
                    </Button>
                </footer>

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
