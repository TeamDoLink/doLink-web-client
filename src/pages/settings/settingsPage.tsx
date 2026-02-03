import { useEffect, useState } from 'react';
import { FeedBack, TabBar } from '@/components/common';
import { FloatingButton } from '@/components/common/button';
import { SettingMenuItem } from '@/components/common/setting/settingMenuItem';
import { GreyLine } from '@/components/common/line/greyLine';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import kakaoIcon from '@/assets/icons/auth/kakao.svg';
import { useAuthStore } from '@/stores/useAuthStore';
import { APP_VERSION } from '@/constants/appVersion';
import { fetchAppVersionInfo } from '@/api/appVersion';
import { isLatestVersion } from '@/utils/versionCompare';
import { openExternalLink } from '@/utils/openExternalLink';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { handleTabChange } = useBottomTabNavigation();
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [versionFetchState, setVersionFetchState] = useState<
    'loading' | 'success' | 'error'
  >('loading');

  useEffect(() => {
    let isMounted = true;

    const loadVersionInfo = async () => {
      try {
        const data = await fetchAppVersionInfo();

        if (!isMounted) return;

        setLatestVersion(data.latest);
        setVersionFetchState('success');
      } catch (error) {
        if (!isMounted) return;

        console.error('Failed to fetch version info', error);
        setVersionFetchState('error');
      }
    };

    loadVersionInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const versionLabel = `버전 ${APP_VERSION}`;
  let versionRightText = '확인 불가';

  if (versionFetchState === 'loading') {
    versionRightText = '확인 중…';
  } else if (versionFetchState === 'error') {
    versionRightText = '확인 불가';
  } else if (latestVersion) {
    const latestCheck = isLatestVersion(APP_VERSION, latestVersion);
    versionRightText =
      latestCheck === null
        ? '확인 불가'
        : latestCheck
          ? '최신 버전입니다'
          : '최신 버전이 아닙니다';
  }

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleConfirmLogout = () => {
    signOut();
    setIsLogoutConfirmOpen(false);
  };

  return (
    <div className='flex min-h-screen flex-col bg-grey-50'>
      <header className='sticky top-0 z-10 flex h-14 items-center px-5'>
        <span className='text-heading-xl text-grey-900'>설정</span>
      </header>
      <main className='grow space-y-4'>
        <div className='rounded-[16px] p-6'>
          <div className='flex items-center gap-3'>
            <img src={kakaoIcon} alt='로그인 아이콘' className='h-12 w-12' />
            <span className='flex flex-col gap-1 text-heading-lg text-grey-900'>
              홍길동 님
            </span>
          </div>

          <div className='mt-6 overflow-hidden rounded-[16px] bg-white py-2 shadow-[0_4px_12px_rgba(0,0,0,0.03)]'>
            <SettingMenuItem
              leftText='공지사항'
              onClick={() =>
                openExternalLink(
                  'https://www.notion.so/2c947f96a7fc80bbb8d4d8009d570b6a'
                )
              }
              rightText='노션(Notion)'
            />
            <SettingMenuItem leftText='고객문의' rightText='카카오 채널' />
            <GreyLine className='my-1' />
            <SettingMenuItem
              leftText='개인정보 처리 방침'
              onClick={() =>
                openExternalLink(
                  'https://www.notion.so/2c947f96a7fc8031afe9ee012bf5821b'
                )
              }
            />
            <SettingMenuItem
              leftText='서비스 이용약관'
              onClick={() =>
                openExternalLink(
                  'https://www.notion.so/2c947f96a7fc80cb9d44db05cd96bf05?source=copy_link'
                )
              }
            />
            <SettingMenuItem
              leftText={versionLabel}
              rightText={versionRightText}
              showArrow={false}
            />
          </div>
        </div>

        <div className='flex justify-center gap-12 text-body-md text-grey-500'>
          <button type='button' onClick={handleLogoutClick}>
            로그아웃
          </button>
          {/* 추후 컴포넌트로 분리 예정 */}
          <div className='h-4 w-px bg-grey-200' />
          <button
            type='button'
            onClick={() => navigate('/settings/withdrawal')}
          >
            회원탈퇴
          </button>
        </div>
      </main>
      <footer className='sticky bottom-0 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
        <div className='relative w-full bg-white'>
          <div className='pointer-events-none absolute -top-[76px] right-6 z-10 flex h-[52px] w-[52px] items-center justify-center'>
            <FloatingButton
              aria-label='새 할 일 추가'
              className='pointer-events-auto'
            />
          </div>
          <TabBar.BottomTabBar value='setting' onChange={handleTabChange} />
        </div>
      </footer>

      <FeedBack.ModalLayout
        open={isLogoutConfirmOpen}
        onClose={handleCancelLogout}
      >
        <FeedBack.ConfirmDialog
          title='정말 로그아웃할까요?'
          positiveLabel='로그아웃하기'
          negativeLabel='취소'
          onPositive={handleConfirmLogout}
          onNegative={handleCancelLogout}
        />
      </FeedBack.ModalLayout>
    </div>
  );
};

export default SettingsPage;
