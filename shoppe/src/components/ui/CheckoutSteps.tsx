import { Steps } from 'antd';

interface CheckoutStepsProps {
  current?: number;
}

const steps = [
  { title: 'Giỏ hàng' },
  { title: 'Đặt hàng' },
  { title: 'Thanh toán' },
];

export default function CheckoutSteps({ current = 1 }: CheckoutStepsProps) {
  return (
    <Steps
      current={current}
      size="small"
      items={steps}
      style={{ marginBottom: 'var(--space-5)', maxWidth: 560, margin: '0 auto var(--space-5)' }}
    />
  );
}
