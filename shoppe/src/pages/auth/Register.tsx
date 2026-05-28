import { Form, Input, Button, Flex } from 'antd';
import { RegisterUser } from '../../api/auth.api';
import { showError, showSuccess } from '../../untils/ShowToast';
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_TEXT_DARK } from '../../constants/Color';
import AuthLayout from '../../components/layout/AuthLayout';
import { passwordRules } from '../../constants/authValidation';

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values: { email: string; password: string; phone: string }) => {
    try {
      const res: any = await RegisterUser({
        email: values.email,
        password: values.password,
        phone: values.phone,
      });
      if (res.success === true) {
        showSuccess('Đăng ký thành công');
        navigate('/auth/login');
      } else {
        showError(res.error);
      }
    } catch (err: any) {
      showError(err?.error);
    }
  };

  return (
    <AuthLayout title="Đăng ký">
      <Form
        layout="vertical"
        form={form}
        onFinish={handleRegister}
        size="large"
        initialValues={{ email: '', password: '', phone: '' }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải gồm đúng 10 chữ số' },
          ]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={passwordRules}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Flex justify="center" style={{ marginTop: 16 }}>
        <span style={{ color: DEFAULT_TEXT_DARK }}>
          Bạn đã có tài khoản?{' '}
          <Link to="/auth/login" style={{ fontWeight: 600 }}>
            Đăng nhập
          </Link>
        </span>
      </Flex>
    </AuthLayout>
  );
};

export default Register;
