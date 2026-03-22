import { useAuthStore } from '@/stores/useAuthStore';
import { useGlobalLoadingStore } from '@/stores/useGlobalLoadingStore';
import ArchiveAfterLogin from './afterLogin';
import ArchiveBeforeLogin from './beforeLogin';
import { Outlet } from 'react-router-dom';

const ArchivePage = () => {
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useGlobalLoadingStore();

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-grey-50 text-body-md text-grey-500'>
        모음 정보를 불러오는 중입니다.
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <ArchiveAfterLogin /> : <ArchiveBeforeLogin />}
      <Outlet />
    </>
  );
};

export default ArchivePage;
