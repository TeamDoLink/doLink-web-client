import { useState } from 'react';
import AppRouter from '@/routes/router';
import AuthProvider from '@/components/auth/AuthProvider';
import SplashScreen from './pages/splashScreen';
import { useNativeNavigate } from '@/hooks/useNativeNavigate';

function App() {
  const [splashDone, setSplashDone] = useState(false);
  useNativeNavigate();

  return (
    <AuthProvider>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
