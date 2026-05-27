import { Flex } from 'antd';
import { memo } from 'react';

interface IInfoRowDetail {
  label: string;
  value?: React.ReactNode;
}

function InfoRowDetail(props: IInfoRowDetail) {
  const { label, value } = props;
  return (
    <Flex align="start" className="pdp-info-row">
      <div className="pdp-info-row__label">{label || 'Đang cập nhật'}</div>
      <div className="pdp-info-row__value">{value || 'Đang cập nhật'}</div>
    </Flex>
  );
}

export default memo(InfoRowDetail);
