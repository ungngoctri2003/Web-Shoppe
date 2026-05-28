import React, { memo } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../css/components/backoffice/DashboardStatCards.css';

export interface StatisticItem {
  title: string;
  value: number;
  prefix: React.ReactNode;
  color?: string;
  suffix?: string;
  path?: string;
}

interface DashboardStatisticProps {
  data: StatisticItem[];
  loading?: boolean;
}

const DashboardStatistic: React.FC<DashboardStatisticProps> = ({
  data,
  loading = false,
}) => {
  const navigate = useNavigate();

  return (
    <Row gutter={[16, 16]} className="dashboard-stat-cards">
      {data.map((item, index) => (
        <Col xs={24} sm={12} md={6} key={item.title}>
          <div
            className={`dashboard-stat-card${item.path ? ' dashboard-stat-card--clickable' : ''}`}
            style={{ animationDelay: `${0.05 + index * 0.07}s` }}
            role={item.path ? 'button' : undefined}
            tabIndex={item.path ? 0 : undefined}
            onClick={() => {
              if (item.path) navigate(item.path);
            }}
            onKeyDown={(e) => {
              if (item.path && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                navigate(item.path);
              }
            }}
          >
            <Skeleton loading={loading} active paragraph={false}>
              <div
                className="dashboard-stat-card__icon"
                style={
                  item.color
                    ? { color: item.color, borderColor: `${item.color}33` }
                    : undefined
                }
              >
                {item.prefix}
              </div>
              <div className="dashboard-stat-card__content">
                <span className="dashboard-stat-card__label">{item.title}</span>
                <span
                  className="dashboard-stat-card__value"
                  style={item.color ? { color: item.color } : undefined}
                >
                  {item.value ?? 0}
                  {item.suffix && (
                    <span className="dashboard-stat-card__suffix">{item.suffix}</span>
                  )}
                </span>
              </div>
            </Skeleton>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default memo(DashboardStatistic);
