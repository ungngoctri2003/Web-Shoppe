import type { ThemeConfig } from 'antd';

export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0d9488',
    colorSuccess: '#16a34a',
    colorWarning: '#f59e0b',
    colorError: '#dc2626',
    colorInfo: '#1e3a5f',
    colorBgLayout: '#f7f7f5',
    colorText: '#292524',
    colorTextSecondary: '#78716c',
    colorBorder: '#e7e5e4',
    borderRadius: 8,
    borderRadiusLG: 12,
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    controlHeight: 40,
    motionDurationMid: '0.15s',
  },
  components: {
    Layout: {
      siderBg: '#134e4a',
      triggerBg: '#0f766e',
    },
    Menu: {
      darkItemBg: '#134e4a',
      darkSubMenuItemBg: '#115e59',
      darkItemSelectedBg: 'rgba(255, 255, 255, 0.14)',
      darkItemColor: 'rgba(255, 255, 255, 0.88)',
      darkItemSelectedColor: '#ffffff',
    },
    Button: {
      primaryShadow: 'none',
    },
    Card: {
      paddingLG: 24,
      boxShadowTertiary: '0 1px 3px rgba(28, 25, 23, 0.06)',
    },
    Table: {
      headerBg: '#fafaf9',
      rowHoverBg: '#f0fdfa',
      borderRadius: 8,
    },
  },
};
