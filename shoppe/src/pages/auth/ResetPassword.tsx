import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ResetPassword } from '../../api/auth.api';
import { DEFAULT_TEXT_DARK } from '../../constants/Color';
import { showError, showSuccess } from '../../untils/ShowToast';
import AuthLayout from '../../components/layout/AuthLayout';
import { newPasswordRules } from '../../constants/authValidation';

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const res: any = await ResetPassword({
        email,
        newPassword: values.newPassword,
      });
      if (res?.success) {
        showSuccess(res.message || 'Đặt lại mật khẩu thành công');
        navigate('/auth/login');
      } else {
        showError(res.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch {
      message.error('Lỗi hệ thống, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đặt lại mật khẩu" subtitle="Nhập mật khẩu mới cho tài khoản của bạn">
      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={newPasswordRules}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Xác nhận
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
