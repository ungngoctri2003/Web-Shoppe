import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

let messageApi: MessageInstance | null = null;

message.config({
  top: 24,
  duration: 3,
  maxCount: 3,
});

export function setMessageApi(api: MessageInstance) {
  messageApi = api;
}

function getMessage() {
  return messageApi ?? message;
}

export const showSuccess = (msg: string) => {
  getMessage().success(msg);
};

export const showError = (msg: string) => {
  getMessage().error(msg);
};

export const showWarning = (msg: string) => {
  getMessage().warning(msg);
};

export const showInfo = (msg: string) => {
  getMessage().info(msg);
};
