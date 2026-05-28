import { useState } from 'react';
import { Button, Col, DatePicker, Flex, Row } from 'antd';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
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
} from 'recharts';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  queryGetAnnualRevenueStatisticsOfSeller,
  queryGetProductPercentageByCategoryOfSeller,
} from '../../api/stastic/stastic.query';
import { formatCompactNumber, formatPriceVND } from '../../untils/FormatPrice';
import StatisticDashboardSeller from './component/StatisticDashboardSeller';
import PageHeader from '../../components/ui/PageHeader';
import BackOfficePage from '../../components/backoffice/BackOfficePage';
import ChartSection from '../../components/backoffice/ChartSection';
import RevealSection from '../../components/ui/RevealSection';
import { CHART_COLORS } from '../../constants/chartColors';
import '../../css/components/backoffice/DashboardQuickActions.css';

const DashboardSeller = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(dayjs().year());

  const { isLoading: isLoadingBarChart, data: revenueData } =
    queryGetAnnualRevenueStatisticsOfSeller({ year });

  const { isLoading: isLoadingPieChart, data: pieData } =
    queryGetProductPercentageByCategoryOfSeller();

  const handleYearChange = (date: dayjs.Dayjs | null) => {
    if (date) setYear(date.year());
  };

  const revenueList = revenueData?.data ?? [];
  const pieList = pieData?.data ?? [];

  return (
    <BackOfficePage>
      <RevealSection delay={0}>
        <PageHeader
          variant="rich"
          eyebrow="Seller"
          title="Bảng điều khiển"
          subtitle="Doanh thu và danh mục sản phẩm của shop"
          breadcrumbs={[{ title: 'Seller' }, { title: 'Dashboard' }]}
        />
      </RevealSection>

      <RevealSection delay={60}>
        <Flex gap={12} wrap="wrap" className="dashboard-quick-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="dashboard-quick-actions__btn"
            onClick={() => navigate('/seller/products/create')}
          >
            Thêm sản phẩm
          </Button>
          <Button
            icon={<UnorderedListOutlined />}
            className="dashboard-quick-actions__btn"
            onClick={() => navigate('/seller/orders')}
          >
            Xem đơn hàng
          </Button>
        </Flex>
      </RevealSection>

      <RevealSection delay={80}>
        <StatisticDashboardSeller />
      </RevealSection>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <ChartSection
            title={`Biểu đồ doanh thu năm ${year}`}
            loading={isLoadingBarChart}
            empty={!isLoadingBarChart && revenueList.length === 0}
            delay={120}
            extra={
              <DatePicker
                picker="year"
                onChange={handleYearChange}
                defaultValue={dayjs()}
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueList}>
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
                <Bar
                  dataKey="revenue"
                  fill="var(--color-primary-500)"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>
        </Col>

        <Col xs={24}>
          <ChartSection
            title="Top 5 danh mục có tỉ lệ sản phẩm nhiều nhất"
            loading={isLoadingPieChart}
            empty={!isLoadingPieChart && pieList.length === 0}
            delay={180}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieList}
                  dataKey="percentage"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) =>
                    `${entry.categoryName} (${entry.percentage}%)`
                  }
                  animationDuration={800}
                >
                  {pieList.map((_: unknown, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _: unknown, entry: { payload?: { categoryName?: string } }) =>
                    `${entry?.payload?.categoryName ?? ''}: ${value}%`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartSection>
        </Col>
      </Row>
    </BackOfficePage>
  );
};

export default DashboardSeller;
