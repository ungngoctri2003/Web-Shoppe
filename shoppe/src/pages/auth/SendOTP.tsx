import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { SendOtp } from '../../api/auth.api';
import { DEFAULT_TEXT_DARK } from '../../constants/Color';
import { showError, showSuccess } from '../../untils/ShowToast';
import AuthLayout from '../../components/layout/AuthLayout';

export default function SendOTP() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (values: { email: string }) => {
    try {
      setLoading(true);
      const res: any = await SendOtp({ email: values.email });
      if (res?.success) {
        showSuccess(res.message || 'OTP đã được gửi qua email');
        navigate('/auth/verifyOTP', { state: { email: values.email } });
      } else {
        showError(res.message || 'Không gửi được OTP');
      }
    } catch {
      message.error('Lỗi hệ thống, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email của bạn để nhận mã OTP xác minh"
    >
      <Form layout="vertical" onFinish={handleSendOtp} size="large">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập email của bạn" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Gửi OTP
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/auth/login" style={{ color: DEFAULT_TEXT_DARK }}>
          ← Quay lại đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
}
