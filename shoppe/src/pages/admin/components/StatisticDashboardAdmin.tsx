import { memo } from "react";
import DashboardStatistic, {
  type StatisticItem,
} from "../../../components/DashboardStatistic";
import {
  AppstoreOutlined,
  GiftOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { queryGetStatisticAdminAsync } from "../../../api/stastic/stastic.query";

function StatisticDashboardAdmin() {
  const { data, isLoading } = queryGetStatisticAdminAsync();
  const statisticData: StatisticItem[] = [
    {
      title: "Người bán",
      value: data?.data?.totalQuantitySeller,
      prefix: <UserOutlined />,
      path: "/admin/seller",
      color: "var(--color-success)",
    },
    {
      title: "Sản phẩm",
      value: data?.data?.totalProducts,
      prefix: <ShopOutlined />,
      color: "var(--color-primary-500)",
      path: "/admin/products",
    },
    {
      title: "Khuyến mãi",
      value: data?.data?.totalVoucher,
      prefix: <GiftOutlined />,
      color: "var(--color-warning)",
      path: "/admin/promotions",
    },
    {
      title: "Danh mục",
      value: data?.data?.totalCategory,
      prefix: <AppstoreOutlined />,
      color: "var(--color-secondary-500)",
      path: "/admin/category",
    },
  ];
  return <DashboardStatistic data={statisticData} loading={isLoading} />;
}

export default memo(StatisticDashboardAdmin);
