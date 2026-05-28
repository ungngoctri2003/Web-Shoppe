import { App, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import AntdAppHolder from '../components/AntdAppHolder';
import { antTheme } from './antTheme';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ConfigProvider theme={antTheme} locale={viVN}>
      <App>
        <AntdAppHolder />
        {children}
      </App>
    </ConfigProvider>
  );
}
