import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const ArchiveBeforeLogin = () => {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-grey-50 px-6 text-center'>
      <h1 className='mb-3 text-heading-sm text-grey-900'>로그인이 필요해요</h1>
      <p className='mb-6 text-body-md text-grey-500'>
        로그인 후 저장한 모음을 확인할 수 있어요.
      </p>
      <button
        type='button'
        className='bg-primary-500 hover:bg-primary-600 rounded-full px-6 py-3 text-body-md font-semibold text-white shadow-md transition'
        onClick={() => navigate(ROUTES.login)}
      >
        로그인하러 가기
      </button>
    </div>
  );
};

export default ArchiveBeforeLogin;
