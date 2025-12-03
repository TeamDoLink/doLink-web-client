import HomeAfterLogin from './afterLogin';
import HomeBeforeLogin from './beforeLogin';

const HomePage = () => {
  const isLoading = false; // TODO: replace with 실제 인증 로딩 상태
  const isAuthenticated = true; // TODO: replace with 실제 인증 여부

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
