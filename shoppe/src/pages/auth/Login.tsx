import { useState } from "react";
import { Form, Input, Button, Flex } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginAPI } from "../../api/auth.api";
import { DEFAULT_TEXT_DARK } from "../../constants/Color";
import { showError, showSuccess } from "../../untils/ShowToast";
import { jwtDecode } from "jwt-decode";
import { ROLE } from "../../constants";
import { useDispatch } from "react-redux";
import { setAppState } from "../../features/slices/app.slice";
import { getUserInfo } from "../../api/user.api";
import { setUserState } from "../../features/slices/user.slice";
import AuthLayout from "../../components/layout/AuthLayout";
import { passwordRules } from "../../constants/authValidation";
import { mergeGuestCartToServer } from "../../services/cartSync";
import { clearLoginRedirect, resolveLoginRedirect } from "../../untils/loginRedirect";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const disptach = useDispatch();

  const handleLogin = async (value: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res: any = await LoginAPI(value);
      if (res?.success) {
        const token = res.data?.token;
        localStorage.setItem("access_token", token);

        const decoded: any = jwtDecode(token);
        const role =
          decoded.role_id ||
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        disptach(setAppState({ role_id: role, token }));

        try {
          const userInfoRes: any = await getUserInfo();
          if (userInfoRes?.success) {
            disptach(setUserState(userInfoRes.data));
          }
        } catch (userErr) {
          console.error("Lấy thông tin người dùng thất bại", userErr);
        }

        showSuccess("Đăng nhập thành công");

        switch (role) {
          case ROLE.ADMIN:
            navigate("/admin/dashboard");
            break;
          case ROLE.SELLER:
            navigate("/seller");
            break;
          default: {
            await mergeGuestCartToServer(disptach);
            const redirectTo = resolveLoginRedirect(location, "/user");
            clearLoginRedirect();
            navigate(redirectTo, { replace: true });
            break;
          }
        }
      }
    } catch (e: any) {
      showError(e?.error || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng nhập">
      <Form layout="vertical" onFinish={handleLogin} size="large">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={passwordRules}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Tiếp tục
          </Button>
        </Form.Item>
      </Form>

      <Flex justify="space-between" style={{ marginTop: 16 }}>
        <span style={{ color: DEFAULT_TEXT_DARK }}>
          Bạn chưa có tài khoản?{" "}
          <Link to="/auth/register" style={{ fontWeight: 600 }}>
            Đăng ký
          </Link>
        </span>
        <Link to="/auth/sendOTP" style={{ fontWeight: 600, color: DEFAULT_TEXT_DARK }}>
          Quên mật khẩu
        </Link>
      </Flex>
    </AuthLayout>
  );
};

export default Login;
