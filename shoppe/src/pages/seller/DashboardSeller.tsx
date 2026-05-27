import { useState } from "react";
import { Card, Col, DatePicker, Row } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import {
  queryGetAnnualRevenueStatisticsOfSeller,
  queryGetProductPercentageByCategoryOfSeller,
} from "../../api/stastic/stastic.query";
import { formatCompactNumber, formatPriceVND } from "../../untils/FormatPrice";
import StatisticDashboardSeller from "./component/StatisticDashboardSeller";
import PageHeader from "../../components/ui/PageHeader";

const CHART_COLORS = ['#ee4d2d', '#1e3a5f', '#16a34a', '#f59e0b', '#64748b', '#dc2626'];

const DashboardSeller = () => {
  const [year, setYear] = useState(dayjs().year());

  const { isLoading: isLoadingBarChart, data: revenueData } =
    queryGetAnnualRevenueStatisticsOfSeller({ year });

  const { isLoading: isLoadingPieChart, data: pieData } =
    queryGetProductPercentageByCategoryOfSeller();

  const handleYearChange = (date: any) => {
    if (date) setYear(date.year());
  };

  // ✅ Kiểm tra dữ liệu
  const hasRevenueData =
    revenueData?.data && Array.isArray(revenueData.data) && revenueData.data.length > 0;

  const hasPieData =
    pieData?.data && Array.isArray(pieData.data) && pieData.data.length > 0;

  return (
    <div>
      <PageHeader
        title="Bảng điều khiển"
        subtitle="Doanh thu và danh mục sản phẩm của shop"
        breadcrumbs={[{ title: 'Seller' }, { title: 'Dashboard' }]}
      />
      {/* ✅ Phần thống kê trên cùng */}
      <StatisticDashboardSeller />

      <Row gutter={[24, 24]}>
        {/* ✅ Biểu đồ doanh thu theo năm (chỉ hiển thị nếu có dữ liệu) */}
        {hasRevenueData && (
          <Col xs={24} md={24}>
            <Card
              title={`Biểu đồ doanh thu năm ${year}`}
              loading={isLoadingBarChart}
              extra={
                <DatePicker
                  picker="year"
                  onChange={handleYearChange}
                  defaultValue={dayjs()}
                />
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData.data}>
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => `Th${value}`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCompactNumber(value)}
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `Doanh thu: ${formatPriceVND(value)}`
                    }
                    labelFormatter={(label) => `Tháng ${label}`}
                  />
                  <Bar dataKey="revenue" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        )}

        {/* ✅ Biểu đồ tỉ lệ danh mục (chỉ hiển thị nếu có dữ liệu) */}
        {hasPieData && (
          <Col xs={24} md={24}>
            <Card
              title="Top 5 danh mục có tỉ lệ sản phẩm nhiều nhất"
              loading={isLoadingPieChart}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData.data}
                    dataKey="percentage"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) =>
                      `${entry.categoryName} (${entry.percentage}%)`
                    }
                  >
                    {pieData.data.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _: any, entry: any) =>
                      `${entry.payload.categoryName}: ${value}%`
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DashboardSeller;
