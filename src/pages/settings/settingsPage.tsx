import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { FeedBack, TabBar } from '@/components/common';
import { FloatingButton } from '@/components/common/button';
import { SettingMenuItem } from '@/components/common/setting/settingMenuItem';
import { GreyLine } from '@/components/common/line/greyLine';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import { useToast } from '@/hooks/useToast';
import { useTaskCreateAction } from '@/hooks/useTaskCreateAction';
import kakaoIcon from '@/assets/icons/auth/kakao.svg';
import logoutIcon from '@/assets/icons/auth/logout.svg';
import { useAuthStore } from '@/stores/useAuthStore';
import { logout, useGetUser } from '@/api/generated/endpoints/user/user';
import type { ApiResponseUserResponse } from '@/api/generated/models';
import { APP_VERSION } from '@/constants/appVersion';
import { ROUTES } from '@/constants/routes';
import { fetchAppVersionInfo } from '@/api/appVersion';
import { isLatestVersion } from '@/utils/versionCompare';
import { openExternalLink } from '@/utils/openExternalLink';
import { sendAuthLogout } from '@/utils/nativeBridge';
import { useAppInfoStore } from '@/stores/useAppInfoStore';

const SettingsPage = () => {
  const { handleTabChange } = useBottomTabNavigation();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const loginToast = useToast();
  const { handleFloatingButtonClick: handleTaskCreateClick, portalNode } =
    useTaskCreateAction();

  // API: 사용자 프로필
  const { data: userData } = useGetUser();
  const userResponse = (userData as unknown as ApiResponseUserResponse)?.result;
  const memberName =
    userResponse?.nickname ?? userResponse?.socialName ?? '사용자';
  const profileImage = userResponse?.profileImageUrl;
  const appVersion = useAppInfoStore((s) => s.version);
  const [versionFetchState, setVersionFetchState] = useState<
    'loading' | 'success' | 'error'
  >('loading');

  const displayedAppVersion = appVersion ?? APP_VERSION;
  const versionLabel = `버전`;
  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleCancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
    } catch {
      // 서버 로그아웃 실패해도 클라이언트 상태는 정리
    } finally {
      clearAuth();
      sendAuthLogout();
      queryClient.clear();
      setIsLogoutConfirmOpen(false);
      navigate(ROUTES.home, { replace: true });
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-grey-50'>
      {/* 헤더 - SettingsAppBar 대신 직접 구현 */}
      <header className='fixed left-0 right-0 top-0 z-50 flex h-14 items-center px-5 py-[14px]'>
        <span className='text-heading-xl text-grey-900'>설정</span>
      </header>

      {/* 메인 컨텐츠 - 헤더와 바텀탭바 높이만큼 패딩 */}
      <main className='grow space-y-4 pb-20 pt-14'>
        <div className='rounded-[16px] px-5 py-[18px]'>
          <div className='flex items-center gap-3'>
            <img
              src={profileImage ?? (isAuthenticated ? kakaoIcon : logoutIcon)}
              alt='프로필'
              className='h-6 w-6 rounded-full object-cover'
            />
            <div className='flex flex-col gap-1 text-heading-lg text-grey-900'>
              {isAuthenticated ? (
                <span>{memberName} 님</span>
              ) : (
                <span className='flex items-center gap-1'>
                  <button
                    type='button'
                    className='underline'
                    onClick={() => navigate(ROUTES.login)}
                  >
                    로그인
                  </button>
                  <span>후 이용해보세요</span>
                </span>
              )}
            </div>
          </div>

          <div className='mt-[16px] overflow-hidden rounded-[16px] bg-white py-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)]'>
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
            {/* <GreyLine width='mx-5' className='my-3' /> */}
            <GreyLine width='w-auto' className='mx-5 my-3' />
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
              rightText={displayedAppVersion}
              showArrow={false}
              data-testid='settings-app-version'
            />
            {/* <SettingMenuItem
              leftText='runtimeVersion'
              rightText={runtimeVersion ?? '-'}
              showArrow={false}
              data-testid='settings-runtime-version'
            /> */}
          </div>
        </div>
        {isAuthenticated && (
          <div className='flex justify-center gap-12 text-body-md text-grey-500'>
            <button type='button' onClick={handleLogoutClick}>
              로그아웃
            </button>
            {/* 추후 컴포넌트로 분리 예정 */}
            <div className='h-4 w-px bg-grey-200' />
            <button
              type='button'
              onClick={() => navigate(ROUTES.settingsWithdrawal)}
            >
              회원탈퇴
            </button>
          </div>
        )}
      </main>

      {/* 하단 고정 버튼 */}
      <FloatingButton
        aria-label='새 할 일 추가'
        className='fixed bottom-[104px] right-6 z-40'
        onClick={handleTaskCreateClick}
      />
      {portalNode}

      {/* 바탭탭바 */}
      <TabBar.BottomTabBar value='setting' onChange={handleTabChange} />

      <FeedBack.ModalLayout
        open={isAuthenticated && isLogoutConfirmOpen}
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

      {loginToast.isVisible && (
        <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
          <FeedBack.Toast
            message={loginToast.message}
            actionLabel='로그인'
            onAction={() => navigate(ROUTES.login)}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
