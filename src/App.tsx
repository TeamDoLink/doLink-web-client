import { useState } from 'react';
import AppRouter from '@/routes/router';
import AuthProvider from '@/components/auth/AuthProvider';
import SplashScreen from './pages/splashScreen';

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <AuthProvider>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
