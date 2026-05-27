import { useEffect, useState } from 'react';
import { Card, List, Steps, Button, message, Spin, Modal, Input, Rate, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/ui/EmptyState';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import dayjs from 'dayjs';
import { getMyPaidOrders } from '../../api/order/order.api';
import { formatCurrency } from '../../untils/FormatPrice';
import '../../css/pages/OrdersPage.css';

const { Step } = Steps;
const { TextArea } = Input;

const MyPaidOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyPaidOrders();
      setOrders(res?.data || []);
    } catch (err: any) {
      message.error(err.response?.data || 'Lấy đơn hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '—');

  const getStepCurrent = (order: any) => {
    if (order?.completedDate || order?.CompletedDate) return 3;
    if (order?.receivedDate || order?.ReceivedDate) return 2;
    if (order?.paymentDate || order?.PaymentDate) return 1;
    return 0;
  };

  const openReviewModal = (orderId: string) => {
    setCurrentOrderId(orderId);
    setReviewText('');
    setRating(5);
    setIsModalVisible(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Đơn mua của tôi"
        breadcrumbs={[
          { title: 'Trang chủ', href: '/user' },
          { title: 'Đơn mua' },
        ]}
      />
      <Spin spinning={loading}>
        {!loading && orders.length === 0 ? (
          <EmptyState
            description="Chưa có đơn hàng nào"
            actionLabel="Tiếp tục mua sắm"
            onAction={() => navigate('/user')}
          />
        ) : (
          <List
            grid={{ gutter: [16, 16], column: 1 }}
            dataSource={orders}
            renderItem={(order: any) => {
              const orderId = order?.id || order?.Id;
              const items = order?.orderItems || order?.OrderItems || [];
              return (
                <List.Item key={orderId}>
                  <Card
                    className="orders-page__card"
                    title={
                      <span className="orders-page__card-title">
                        Mã đơn: <strong>{orderId}</strong>
                      </span>
                    }
                    extra={
                      <Tag color="processing">
                        {formatCurrency(order?.totalAmount || order?.TotalAmount)} đ
                      </Tag>
                    }
                  >
                    <Steps
                      current={getStepCurrent(order)}
                      size="small"
                      className="orders-page__steps"
                    >
                      <Step
                        title="Đã đặt"
                        description={formatDate(order?.created || order?.Created)}
                      />
                      <Step
                        title="Đã thanh toán"
                        description={formatDate(order?.paymentDate || order?.PaymentDate)}
                      />
                      <Step
                        title="Đã nhận"
                        description={formatDate(order?.receivedDate || order?.ReceivedDate)}
                      />
                      <Step
                        title="Hoàn thành"
                        description={formatDate(order?.completedDate || order?.CompletedDate)}
                      />
                    </Steps>
                    <List
                      dataSource={items}
                      renderItem={(item: any) => (
                        <List.Item key={item.id || item.Id}>
                          <List.Item.Meta
                            avatar={
                              (item.productImage || item.ProductImage) ? (
                                <img
                                  src={item.productImage || item.ProductImage}
                                  alt={item.productName || item.ProductName}
                                  className="orders-page__item-img"
                                  loading="lazy"
                                />
                              ) : undefined
                            }
                            title={item.productName || item.ProductName}
                            description={`SL: ${item.quantity || item.Quantity} · ${formatCurrency(item.price ?? item.Price)} đ`}
                          />
                        </List.Item>
                      )}
                    />
                    <div className="orders-page__actions">
                      <Button type="primary" onClick={() => navigate(`/user/order/${orderId}`)}>
                        Xem chi tiết
                      </Button>
                      {(order?.completedDate || order?.CompletedDate) && (
                        <Button type="default" onClick={() => openReviewModal(orderId)}>
                          Đánh giá sản phẩm
                        </Button>
                      )}
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        )}

        <Modal
          title="Đánh giá sản phẩm"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={submitLoading}
          okText="Gửi đánh giá"
        >
          <div style={{ marginBottom: 12 }}>
            <span>Đánh giá: </span>
            <Rate value={rating} onChange={setRating} />
          </div>
          <TextArea
            rows={4}
            placeholder="Viết nhận xét của bạn..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </Modal>
      </Spin>
    </PageContainer>
  );
};

export default MyPaidOrders;
