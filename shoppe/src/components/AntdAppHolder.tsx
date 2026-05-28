import { App } from 'antd';
import { useEffect } from 'react';
import { setMessageApi } from '../untils/ShowToast';

/** Registers App.useApp() message API for static toast helpers. */
export default function AntdAppHolder() {
  const { message } = App.useApp();

  useEffect(() => {
    setMessageApi(message);
  }, [message]);

  return null;
}
