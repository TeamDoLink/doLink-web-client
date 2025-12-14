import { useAuthStore } from '@/stores/useAuthStore';
import { useGlobalLoadingStore } from '@/stores/useGlobalLoadingStore';
import HomeAfterLogin from './afterLogin';
import HomeBeforeLogin from './beforeLogin';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useGlobalLoadingStore();

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-grey-50 text-body-md text-grey-500'>
        홈 정보를 불러오는 중입니다.
      </div>
    );
  }

  return isAuthenticated ? <HomeAfterLogin /> : <HomeBeforeLogin />;
};

export default HomePage;
