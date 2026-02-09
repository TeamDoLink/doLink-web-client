import AppRouter from '@/routes/router';
import AuthProvider from '@/components/auth/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
