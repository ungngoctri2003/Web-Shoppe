import UserLayout from "../layout/UserLayout";
import HomePage from "../pages/user/HomePage";
import CartPage from "../pages/user/CartPage";
import ProductDetailPage from "../pages/user/ProductDetailPage";
import ShopPage from "../pages/user/ShopPage";
import OrderDetail from "../pages/user/OrderDetailPage";
import ProductsPage from "../pages/user/ProductsPage";
import MyPaidOrders from "../pages/user/MyPaidOrders";
import Profile from "../pages/admin/Profile";
import PaymentResult from "../pages/user/PaymentResultPage";
import AboutPage from "../pages/user/AboutPage";

const UserRoutes = [
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "products", // 👈 chỉ cần /user/products, query lấy bằng useSearchParams
        element: <ProductsPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "shop/:sellerId",
        element: <ShopPage />,
      },
      {
        path: "checkout",
        element: <OrderDetail />,
      },
      {
        path: "order/:orderId",
        element: <OrderDetail />,
      },
      {
        path: "payment/result",
        element: <PaymentResult />,
      },
      {
        path: "orderstatus",
        element: <MyPaidOrders />,
      },
      {
        path: "profile",
        element: <Profile />,
      }

    ],
  },
];

export default UserRoutes;
