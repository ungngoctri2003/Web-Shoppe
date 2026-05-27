import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button, Result, Spin } from 'antd';
import PageContainer from '../../components/ui/PageContainer';
import '../../css/pages/CheckoutPage.css';

function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  const txnRef = params.get('txnRef');
  const isSuccess = status === '00';

  useEffect(() => {
    if (!status) {
      navigate('/user');
      return;
    }
    if (isSuccess) {
      const timer = setTimeout(() => navigate('/user/orderstatus'), 4000);
      return () => clearTimeout(timer);
    }
  }, [status, isSuccess, navigate]);

  if (!status) {
    return (
      <PageContainer style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </PageContainer>
    );
  }

  if (!isSuccess) {
    return (
      <PageContainer className="page-container--narrow">
        <div className="payment-result-section">
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle="Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
            extra={[
              <Button type="primary" key="cart" onClick={() => navigate('/user/cart')}>
                Quay lại giỏ hàng
              </Button>,
              <Button key="home" onClick={() => navigate('/user')}>
                Về trang chủ
              </Button>,
            ]}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="page-container--narrow">
      <div className="payment-result-section">
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={
            <>
              Cảm ơn bạn đã mua hàng.
              {txnRef && (
                <>
                  <br />
                  Mã giao dịch: <strong>{txnRef}</strong>
                </>
              )}
              <br />
              <span className="payment-result-section__hint">
                Tự động chuyển đến đơn hàng sau vài giây...
              </span>
            </>
          }
          extra={[
            <Button type="primary" key="orders" onClick={() => navigate('/user/orderstatus')}>
              Xem đơn hàng
            </Button>,
            <Button key="shop" onClick={() => navigate('/user')}>
              Tiếp tục mua sắm
            </Button>,
          ]}
        />
      </div>
    </PageContainer>
  );
}

export default PaymentResult;
