import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Spin,
    Divider,
    Button,
    Flex,
} from "antd";
import {
    createOrder,
    getOrderDetail,
    paymentOrder,
} from "../../api/order/order.api";
import { getUserAddresses } from "../../api/address/address.api";
import AddressManagement from "./AddressManagement";
import { formatCurrency } from "../../untils/FormatPrice";
import VoucherModal from "./VoucherModal";
import { ArrowLeftOutlined, BarcodeOutlined, CloseOutlined } from "@ant-design/icons";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import CheckoutSteps from "../../components/ui/CheckoutSteps";
import "../../css/pages/CheckoutPage.css";
import { showError, showInfo, showSuccess, showWarning } from "../../untils/ShowToast";

const { Text, Title } = Typography;

// ------------------ Types ------------------
interface OrderItem {
    id?: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    thumbnail: string;
    productVariantId?: string | null;
    variantName?: string | null;
    variantValue?: string | null;
    priceVariant?: number | null;
}

interface Order {
    id: string;
    status: string;
    orderItems: OrderItem[];
    totalAmount: number;
    originalAmount: number;
    addressId?: string;
    promotionCode?: string | null;
    paymentMethod?: string;
}

interface Address {
    id: string;
    fullName: string;
    phoneNumber: string;
    addressDetail: string;
    city?: string;
    province?: string;
    isDefault?: boolean;
}

interface Voucher {
    code: string;
    discountAmount?: number;
    discountPercent?: number;
}

// ------------------ Component ------------------
const OrderDetail = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const location = useLocation();
    const selectedItems: OrderItem[] = location.state?.items || [];
    const cartItemIds: string[] = location.state?.cartItemIds || [];
    const appliedVoucherFromCart: (Voucher & { discount?: number }) | null =
        location.state?.appliedVoucher ?? null;
    const navigate = useNavigate();
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail(orderId);
        } else if (selectedItems.length > 0) {
            const originalAmount = selectedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            const discount = appliedVoucherFromCart?.discount ?? 0;
            const totalAmount = Math.max(0, originalAmount - discount);

            if (appliedVoucherFromCart?.code) {
                setSelectedVoucher(appliedVoucherFromCart);
            }

            setOrder({
                id: "TEMP-CHECKOUT",
                status: "Pending",
                orderItems: selectedItems,
                totalAmount,
                originalAmount,
                promotionCode: appliedVoucherFromCart?.code ?? null,
                paymentMethod: "VNPay",
            });
            setCartTotal(totalAmount);
        }
        fetchAddresses();
    }, [orderId]);

    // Lấy chi tiết đơn hàng
    const fetchOrderDetail = async (id: string) => {
        setLoading(true);
        try {
            const res: any = await getOrderDetail(id);
            if (!res) {
                showError("Không tìm thấy đơn hàng.");
                return;
            }
            setOrder({
                ...res,
                originalAmount: res.originalAmount ?? res.totalAmount,
            });
        } catch (error) {
            console.error(error);
            showError("Không thể tải chi tiết đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    // Lấy địa chỉ người dùng
    const fetchAddresses = async () => {
        try {
            const res: any = await getUserAddresses();
            const list: Address[] = Array.isArray(res) ? res : res.data || [];
            setAddresses(list);

            if (!selectedAddressId) {
                const defaultAddr = list.find((a) => a.isDefault);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                }
            }
        } catch (error) {
            console.error(error);
            showError("Không thể tải địa chỉ.");
        }
    };

    // Khi chọn voucher
    const handleApplyVoucher = (voucher: Voucher | null) => {
        if (!order) return;

        // ✅ Nếu voucher null hoặc bấm lại đúng voucher đang chọn → bỏ chọn
        if (
            !voucher ||
            (selectedVoucher && voucher && selectedVoucher.code === voucher.code)
        ) {
            setSelectedVoucher(null);
            setOrder({
                ...order,
                promotionCode: null,
                totalAmount: order.originalAmount,
            });
            setCartTotal(order.originalAmount);
            showInfo("Đã bỏ chọn voucher.");
            return;
        }

        // ✅ Ngược lại: áp dụng voucher mới
        let newTotal = order.originalAmount;

        if (voucher.discountAmount) {
            newTotal -= voucher.discountAmount;
        } else if (voucher.discountPercent) {
            newTotal -= (order.originalAmount * voucher.discountPercent) / 100;
        }

        if (newTotal < 0) newTotal = 0;

        setSelectedVoucher(voucher);
        setOrder({
            ...order,
            promotionCode: voucher.code,
            totalAmount: newTotal,
        });
        setCartTotal(newTotal);
        showSuccess(`Đã áp dụng mã: ${voucher.code}`);
    };


    // ------------------ Thanh toán ------------------
    const handlePayment = async () => {
        if (!order) return;
        if (!selectedAddressId) {
            showWarning("Vui lòng chọn địa chỉ giao hàng trước.");
            return;
        }

        try {
            setLoading(true);
            let orderIdToPay = order.id;
            let totalAmount = order.totalAmount;

            // Nếu là checkout tạm thì tạo order mới
            if (orderIdToPay === "TEMP-CHECKOUT") {
                const payload = {
                    addressId: selectedAddressId,
                    promotionCode: order.promotionCode || null,
                    paymentMethod: order.paymentMethod || "VNPay",
                    items: order.orderItems.map((i) => ({
                        productId: i.productId,
                        productVariantId: i.productVariantId ?? null,
                        quantity: i.quantity,
                    })),
                    cartItemIds,
                };

                const res: any = await createOrder(payload);
                if (!res?.success || !res.data) {
                    showError(res?.message || "Không thể tạo đơn hàng.");
                    return;
                }

                orderIdToPay = res.data.id;
                totalAmount = res.data.totalAmount;

                setOrder((prev) =>
                    prev
                        ? {
                            ...prev,
                            id: orderIdToPay,
                            totalAmount: totalAmount,
                            originalAmount: res.data.originalAmount ?? totalAmount,
                        }
                        : null
                );
            }

            // Gọi API thanh toán
            const payReq = { orderId: orderIdToPay, amount: totalAmount };
            const payRes: any = await paymentOrder(payReq);

            if (payRes?.paymentUrl) {
                window.open(payRes.paymentUrl, "_blank"); // Mở trong tab mới
            } else {
                showError("Không lấy được link thanh toán.");
            }
        } catch (err) {
            console.error("🚀 ~ handlePayment error:", err);
            showError("Thanh toán thất bại.");
        } finally {
            setLoading(false);
        }
    };

    // Lấy địa chỉ hiển thị
    const orderAddress: Address | null =
        addresses.find((a) => a.id === selectedAddressId) ||
        (order?.addressId ? addresses.find((a) => a.id === order.addressId) || null : null);

    if (loading && !order) {
        return (
            <PageContainer style={{ textAlign: "center", padding: 48 }}>
                <Spin size="large" tip="Đang tải đơn hàng...">
                    <div style={{ minHeight: 120, minWidth: 200 }} aria-hidden />
                </Spin>
            </PageContainer>
        );
    }

    const isCheckout = !orderId;

    return (
        <PageContainer className="page-container--narrow">
        <div className="checkout-page">
            <PageHeader
                title={isCheckout ? 'Xác nhận đơn hàng' : 'Chi tiết đơn hàng'}
                breadcrumbs={[
                    { title: 'Trang chủ', href: '/user' },
                    isCheckout
                        ? { title: 'Giỏ hàng', href: '/user/cart' }
                        : { title: 'Đơn mua', href: '/user/orderstatus' },
                    { title: isCheckout ? 'Thanh toán' : 'Chi tiết' },
                ]}
                extra={
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(isCheckout ? '/user/cart' : '/user/orderstatus')}
                    >
                        Quay lại
                    </Button>
                }
            />
            <CheckoutSteps current={isCheckout ? 1 : 2} />

            <div className="checkout-page__layout">
            <div className="checkout-page__main">
            <Card className="checkout-page__card" styles={{ body: { padding: 24 } }}>
                {/* Địa chỉ giao hàng */}
                <Card type="inner" title="Địa chỉ giao hàng" className="checkout-page__address-card">
                    {orderAddress ? (
                        <>
                            <div style={{ marginBottom: 4 }}>
                                <Text strong>
                                    {orderAddress.fullName} - {orderAddress.phoneNumber}
                                </Text>
                            </div>
                            <Flex gap={16} justify="space-between" align="center">
                                <div className="checkout-page__address-text">
                                    {orderAddress.addressDetail}
                                    {orderAddress.city ? `, ${orderAddress.city}` : ""}
                                    {orderAddress.province ? `, ${orderAddress.province}` : ""}
                                </div>
                                <div>
                                    {orderAddress.isDefault && (
                                        <Tag color="blue" style={{ marginRight: 8 }}>
                                            Mặc định
                                        </Tag>
                                    )}
                                    <Button type="link" onClick={() => setIsAddressModalOpen(true)}>
                                        Chọn/Sửa địa chỉ
                                    </Button>
                                </div>
                            </Flex>
                        </>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text type="secondary">Chưa có địa chỉ giao hàng</Text>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => setIsAddressModalOpen(true)}
                            >
                                Thêm/Sửa địa chỉ
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Danh sách sản phẩm */}
                {order?.orderItems?.map((item, idx) => (
                    <Card
                        key={item.id || idx}
                        className="checkout-page__product-card"
                        styles={{ body: { padding: 16 } }}
                    >
                        <Row gutter={16} align="middle">
                            <Col xs={8} sm={6}>
                                <img
                                    src={item.thumbnail}
                                    alt={item.productName}
                                    className="checkout-page__product-img"
                                />
                            </Col>
                            <Col xs={16} sm={12}>
                                <Title level={5}>{item.productName || "Tên sản phẩm"}</Title>
                                <Text type="secondary">Số lượng: {item.quantity}</Text>
                                {item.variantName && (
                                    <div>
                                        <Text type="secondary">
                                            {item.variantName}: {item.variantValue}
                                        </Text>
                                    </div>
                                )}
                            </Col>
                            <Col xs={24} sm={6} style={{ textAlign: "right" }}>
                                <Title level={5} className="checkout-page__product-price">
                                    {formatCurrency(item.price)}
                                </Title>
                            </Col>
                        </Row>
                    </Card>
                ))}

                <Divider />

                <Row className="checkout-page__voucher-row">
                    <Col span={24}>
                        <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
                            <Flex align="center">
                                <BarcodeOutlined style={{ fontSize: 23, color: 'var(--color-primary-500)' }} />
                                <Text style={{ marginLeft: 8, fontSize: 16 }}>Shopping Voucher</Text>
                            </Flex>
                            {selectedVoucher ? (
                                <div
                                    className="checkout-page__voucher-chip"
                                    onClick={() => handleApplyVoucher(null)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleApplyVoucher(null);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <BarcodeOutlined className="checkout-page__voucher-chip-icon" />
                                    <span>
                                        {selectedVoucher.code ||
                                            `Giảm ${selectedVoucher.discountPercent}%`}
                                    </span>
                                    <CloseOutlined />
                                </div>
                            ) : (
                                <Button type="link" onClick={() => setIsVoucherModalOpen(true)}>
                                    Chọn voucher
                                </Button>
                            )}
                        </Flex>
                    </Col>
                </Row>
            </Card>
            </div>

            <aside className="checkout-page__summary">
                <Card className="checkout-page__summary-card" styles={{ body: { padding: 24 } }}>
                    <Title level={4}>Tóm tắt đơn hàng</Title>
                    <Divider />
                    <Title level={3} className="checkout-page__total">
                        Tổng: {formatCurrency(order?.totalAmount || 0)}
                    </Title>
                    {order?.paymentMethod && (
                        <Text type="secondary">Thanh toán: {order.paymentMethod}</Text>
                    )}
                    <Button
                        type="primary"
                        size="large"
                        className="checkout-page__pay-btn"
                        onClick={handlePayment}
                        loading={loading}
                    >
                        Thanh toán
                    </Button>
                </Card>
            </aside>
            </div>

            {/* Modal quản lý địa chỉ */}
            <AddressManagement
                visible={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSaved={fetchAddresses}
                selectedId={selectedAddressId || order?.addressId || null}
                onSelect={(id) => setSelectedAddressId(id)}
            />

            {/* Modal chọn voucher */}
            <VoucherModal
                visible={isVoucherModalOpen}
                onClose={() => setIsVoucherModalOpen(false)}
                onApply={handleApplyVoucher}
                cartTotal={cartTotal}
            />
        </div>
        </PageContainer>
    );
};

export default OrderDetail;
