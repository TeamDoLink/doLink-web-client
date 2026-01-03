import { useNavigate } from 'react-router-dom';
import { BackDetailBar } from '@/components/common/appBar';
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

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <BackDetailBar title='' rightIcons={[]} onClickBack={handleBack} />

      <main className='flex grow flex-col items-center p-10'>
        <section className='flex grow flex-col items-center justify-center gap-5'>
          <p className='self-start text-heading-xl text-grey-800'>
            담고, 실천하기
          </p>
          <img src={logo} alt='DoLink 로고' className='h-[52px] w-[164px]' />
        </section>

        <section className='flex flex-col items-center gap-6 pb-28'>
          <p className='text-body-lg text-grey-500'>
            SNS 계정으로 간편 가입하기
          </p>
          <div className='flex items-center gap-6'>
            <button
              type='button'
              className={`flex ${SOCIAL_BUTTON_SIZE} items-center justify-center rounded-full bg-transparent`}
              aria-label='카카오로 로그인'
            >
              <img
                src={kakaoIcon}
                alt='카카오'
                className={SOCIAL_BUTTON_SIZE}
              />
            </button>
            <button
              type='button'
              className={`flex ${SOCIAL_BUTTON_SIZE} items-center justify-center rounded-full bg-transparent`}
              aria-label='네이버로 로그인'
            >
              <img
                src={naverIcon}
                alt='네이버'
                className={SOCIAL_BUTTON_SIZE}
              />
            </button>
            <button
              type='button'
              className={`flex ${SOCIAL_BUTTON_SIZE} items-center justify-center rounded-full bg-transparent`}
              aria-label='애플로 로그인'
            >
              <img src={appleIcon} alt='애플' className={SOCIAL_BUTTON_SIZE} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
