import { useNavigate } from 'react-router-dom';
import { BackDetailBar } from '@/components/common/appBar';
import { API_BASE_URL } from '@/api/axios-instance';
import kakaoIcon from '@/assets/icons/auth/kakao.svg';
import naverIcon from '@/assets/icons/auth/naver.svg';
import appleIcon from '@/assets/icons/auth/apple.svg';
import logo from '@/assets/logos/logo.svg';

const SOCIAL_BUTTON_SIZE = 'h-14 w-14';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <BackDetailBar title='' rightIcons={[]} onClickBack={handleBack} />

      <main className='flex grow flex-col px-6 pb-40 pt-24'>
        <section className='mx-auto flex w-fit flex-col items-start gap-3'>
          <p className='text-heading-xl text-grey-800'>담고, 실천하기</p>
          <img src={logo} alt='DoLink 로고' className='h-[52px] w-[164px]' />
        </section>

        <div className='flex-1' />
        <section className='flex flex-col items-center gap-5'>
          <p className='text-body-lg text-grey-500'>
            SNS 계정으로 간편 가입하기
          </p>
          <div className='flex items-center gap-6'>
            <button
              type='button'
              className={`flex ${SOCIAL_BUTTON_SIZE} items-center justify-center rounded-full bg-transparent`}
              aria-label='카카오로 로그인'
              onClick={handleKakaoLogin}
            >
              <img src={kakaoIcon} alt='' className={SOCIAL_BUTTON_SIZE} />
            </button>
            {/* <button
              type='button'
              className={`flex ${SOCIAL_BUTTON_SIZE} items-center justify-center rounded-full bg-transparent`}
              aria-label='네이버로 로그인'
            >
              <img src={naverIcon} alt='' className={SOCIAL_BUTTON_SIZE} />
            </button>
            <button
              type='button'
              className={`flex ${SOCIAL_BUTTON_SIZE} items-center justify-center rounded-full bg-transparent`}
              aria-label='애플로 로그인'
            >
              <img src={appleIcon} alt='' className={SOCIAL_BUTTON_SIZE} />
            </button> */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
