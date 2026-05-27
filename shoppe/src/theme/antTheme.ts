import type { ThemeConfig } from 'antd';

export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: '#ee4d2d',
    colorSuccess: '#16a34a',
    colorWarning: '#f59e0b',
    colorError: '#dc2626',
    colorInfo: '#1e3a5f',
    colorBgLayout: '#f8fafc',
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    colorBorder: '#e2e8f0',
    borderRadius: 8,
    borderRadiusLG: 12,
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    controlHeight: 40,
    motionDurationMid: '0.15s',
  },
  components: {
    Layout: {
      siderBg: '#1e3a5f',
      triggerBg: '#162d4a',
    },
    Menu: {
      darkItemBg: '#1e3a5f',
      darkSubMenuItemBg: '#162d4a',
    },
    Button: {
      primaryShadow: 'none',
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: '#f8fafc',
    },
  },
};
