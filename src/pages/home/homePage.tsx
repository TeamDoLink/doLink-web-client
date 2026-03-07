import { useAuthStore } from '@/stores/useAuthStore';
import HomeAfterLogin from './afterLogin';
import HomeBeforeLogin from './beforeLogin';

const HomePage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return isAuthenticated ? <HomeAfterLogin /> : <HomeBeforeLogin />;
};

export default HomePage;
