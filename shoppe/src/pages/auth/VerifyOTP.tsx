import { useState, useRef } from 'react';
import { Form, Input, Button, message } from 'antd';
import type { InputRef } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { VerifyOtp } from '../../api/auth.api';
import { DEFAULT_TEXT_DARK } from '../../constants/Color';
import { showError, showSuccess } from '../../untils/ShowToast';
import AuthLayout from '../../components/layout/AuthLayout';

export default function VerifyOTP() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<(InputRef | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      message.error('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    try {
      setLoading(true);
      const res: any = await VerifyOtp({ email, otp: code });
      if (res?.success) {
        showSuccess(res.message || 'Xác thực thành công');
        navigate('/auth/reset-password', { state: { email } });
      } else {
        showError(res.message || 'OTP không chính xác');
      }
    } catch {
      message.error('Lỗi hệ thống, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Xác minh OTP"
      subtitle="Nhập mã OTP gồm 6 chữ số đã gửi đến email của bạn"
    >
      <Form onFinish={handleVerifyOtp}>
        <div className="auth-layout__otp-inputs">
          {otp.map((value, index) => (
            <Input
              key={index}
              value={value}
              maxLength={1}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="auth-layout__otp-input"
            />
          ))}
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/auth/sendOTP" style={{ color: DEFAULT_TEXT_DARK }}>
          ← Quay lại nhập email
        </Link>
      </div>
    </AuthLayout>
  );
}
