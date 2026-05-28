import { memo } from "react";
import DashboardStatistic, {
    type StatisticItem,
} from "../../../components/DashboardStatistic";
import {
    AppstoreOutlined,
    GiftOutlined,
    ShopOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { queryGetStatisticSellerAsync } from "../../../api/stastic/stastic.query";

function StatisticDashboardSeller() {
    const { data, isLoading } = queryGetStatisticSellerAsync();
    const statisticData: StatisticItem[] = [
        {
            title: "Sản phẩm",
            value: data?.data?.totalProducts,
            prefix: <ShopOutlined />,
            path: "/seller/products",
            color: "var(--color-primary-500)",
        },
        {
            title: "Danh mục",
            value: data?.data?.totalCategories,
            prefix: <AppstoreOutlined />,
            color: "var(--color-secondary-500)",
            path: "/seller/category",
        },
        {
            title: "Đơn hàng",
            value: data?.data?.totalOrders,
            prefix: <UnorderedListOutlined />,
            color: "var(--color-warning)",
            path: "/seller/orders",
        },
    ];
    return <DashboardStatistic data={statisticData} loading={isLoading} />;
}

export default memo(StatisticDashboardSeller);
