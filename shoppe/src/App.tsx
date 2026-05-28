import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserInfo } from "./api/user.api";
import { showError, showWarning } from "./untils/ShowToast";
import { setUserState } from "./features/slices/user.slice";
import { setAppState } from "./features/slices/app.slice";
import AppRoutes from "./routes/AppRoutes";
import { ROLE } from "./constants";
import { fetchServerCart, loadCartForSession } from "./services/cartSync";

function App() {
  const dispatch = useDispatch();

  const token = localStorage.getItem("access_token");
  const fetchUserInfo = async () => {
    try {
      const res: any = await getUserInfo();
      if (res?.success) {
        dispatch(setUserState(res?.data));
        dispatch(
          setAppState({
            role_id: res?.data?.role,
            token: token || "",
          })
        );
        if (res?.data?.role === ROLE.USER) {
          fetchServerCart(dispatch);
        }
      } else {
        showWarning(res?.message || "Đăng nhập thất bại");
      }
    } catch {
      showError("Lấy thông tin người dùng thất bại");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    } else {
      loadCartForSession(dispatch, null);
    }
  }, [token]);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
