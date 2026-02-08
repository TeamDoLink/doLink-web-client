import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BackDetailBar } from '@/components/common/appBar';
import kakaoIcon from '@/assets/icons/auth/kakao.svg';
import naverIcon from '@/assets/icons/auth/naver.svg';
import appleIcon from '@/assets/icons/auth/apple.svg';
import logo from '@/assets/logos/logo.svg';
import { AXIOS_INSTANCE } from '@/api/axios-instance';
import { useAuthStore } from '@/stores/useAuthStore';

const SOCIAL_BUTTON_SIZE = 'h-14 w-14';

const LoginPage = () => {
  const navigate = useNavigate();
  const setServerOffline = useAuthStore((s) => s.setServerOffline);

  const handleBack = () => {
    navigate(-1);
  };

  // Vite 프록시 사용 시 주석 처리
  // TODO http://localhost:8080 ->  환경변수 처리
  // const KAKAO_AUTH_URL = 'http://localhost:8080/oauth2/authorization/kakao';
  const handleKakaoLogin = async () => {
    // 소셜 로그인은 브라우저 리다이렉트이므로, 서버가 꺼져 있으면 바로 브라우저 에러 페이지가 뜸.
    // 따라서 리다이렉트 전 가벼운 요청으로 서버 상태를 먼저 확인.
    try {
      // /v1/auth/reissue 또는 다른 가벼운 API로 체크
      await AXIOS_INSTANCE.post('/v1/auth/reissue');

      const KAKAO_AUTH_URL = '/oauth2/authorization/kakao';
      window.location.href = KAKAO_AUTH_URL;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        // 서버 연결 실패 또는 프록시 에러 (500, 502, 503, 504) 감지
        if (
          !error.response ||
          (status && [500, 502, 503, 504].includes(status))
        ) {
          setServerOffline(true);
          return;
        }
      }

      // 인증 에러(401) 등 서버는 살아있는 경우는 리다이렉트 진행
      const KAKAO_AUTH_URL = '/oauth2/authorization/kakao';
      window.location.href = KAKAO_AUTH_URL;
    }
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
            <button
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
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
