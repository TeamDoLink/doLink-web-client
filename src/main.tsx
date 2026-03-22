import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/styles/global.css';
import { initMockReactNativeWebView } from '@/utils/MockReactNativeWebView';
import { initAppInfoBridge } from '@/utils/nativeBridge';
import App from './App';
import KeyboardAwareProvider from '@/components/providers/KeyboardAwareProvider';

initMockReactNativeWebView();
initAppInfoBridge();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <KeyboardAwareProvider>
          <App />
        </KeyboardAwareProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
