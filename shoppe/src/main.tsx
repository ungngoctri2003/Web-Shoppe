import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './features/store.tsx';
import { Provider } from 'react-redux';
import 'antd/dist/reset.css';
import AppThemeProvider from './theme/AppThemeProvider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
