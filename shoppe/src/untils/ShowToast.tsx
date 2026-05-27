import { message } from 'antd';

message.config({
  top: 24,
  duration: 3,
  maxCount: 3,
});

export const showSuccess = (msg: string) => {
  message.success(msg);
};

export const showError = (msg: string) => {
  message.error(msg);
};

export const showWarning = (msg: string) => {
  message.warning(msg);
};
