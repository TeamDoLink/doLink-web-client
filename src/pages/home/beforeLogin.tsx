import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Background, FeedBack, List, TabBar } from '@/components/common';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import heroIllustration from '@/assets/icons/home/beforelogin.svg';
import moreBlueIcon from '@/assets/icons/common/more-blue.svg';
import { FloatingButton } from '@/components/common/button';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import {
  BEFORE_LOGIN_ARCHIVE,
  BEFORE_LOGIN_TODO,
} from '@/constants/beforeLoginData';
import { ROUTES } from '@/constants/routes';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';
import { formatRelativeDateLabel } from '@/utils/date';
import { useTutorialTaskStore } from '@/stores/useTutorialTaskStore';

/**
 * 미로그인 홈화면 전용 로그인 버튼
 * 86x26 크기의 커스텀 버튼
 */
const LoginButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='mt-[10px] inline-flex h-[26px] w-[86px] items-center rounded-[20px] bg-[#394CFF26] pl-2 text-body-sm text-point transition active:bg-[#394CFF4C]'
    >
      <span>로그인하기</span>
      <img src={moreBlueIcon} alt='더보기' className='h-4 w-4' />
    </button>
  );
};

const HomeBeforeLogin = () => {
  const navigate = useNavigate();
  const { handleTabChange } = useBottomTabNavigation();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'login' | 'defaultArchive' | null>(
    null
  );
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [suppressCompleteModal, setSuppressCompleteModal] = useState(false);
  const { isTaskCompleted, toggleTask } = useTutorialTaskStore();
  const toastTimerRef = useRef<number | null>(null);
  const todoItems = BEFORE_LOGIN_TODO();
  const archiveItems = BEFORE_LOGIN_ARCHIVE();

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleLoginClick = () => {
    navigate(ROUTES.login);
  };

  const showToastWithType = (type: 'login' | 'defaultArchive') => {
    setToastType(type);
    setShowToast(true);
    if (toastTimerRef.current !== null) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setShowToast(false);
      toastTimerRef.current = null;
    }, 3000);
  };

  const triggerLoginToast = () => {
    showToastWithType('login');
  };

  const handleTodoCheckbox = (id: string, checked: boolean) => {
    toggleTask(id);
    if (checked && !suppressCompleteModal) {
      setShowCompleteModal(true);
    }
  };

  const handleCreateTodo = () => {
    triggerLoginToast();
  };

  const handleTodoClick = () => {
    navigate(ROUTES.taskDetail + '/tutorial');
  };

  const handleOpenTutorialArchive = () => {
    navigate(ROUTES.archiveTutorial);
  };

  const handleClickSearch = () => {
    navigate(ROUTES.search);
  };

  return (
    <div className='relative flex min-h-screen flex-col'>
      <Background.GradientBackground className='flex min-h-0 flex-1 flex-col'>
        <HomeAppBar onClickSearch={handleClickSearch} />

        <main className='relative grow pt-14'>
          <div className='mx-auto flex flex-col px-5'>
            <section className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <h1 className='text-heading-xl text-black'>
                  두링크가 처음이라면
                </h1>
                <LoginButton onClick={handleLoginClick} />
              </div>
              <img
                src={heroIllustration}
                alt='홈 일러스트'
                className='h-[90px] w-[90px] flex-shrink-0 object-contain'
              />
            </section>

            <section className='mt-5 space-y-4'>
              <h2 className='text-heading-sm text-black'>할 일</h2>
              <div className='space-y-4 rounded-2xl bg-white py-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)]'>
                {todoItems.map(({ id, title, platform, createdAt }) => (
                  <List.TodoItem
                    key={id}
                    title={title}
                    subtitle={`${formatRelativeDateLabel(createdAt)} · ${platform}`}
                    checked={isTaskCompleted(id)}
                    onChange={(newChecked) =>
                      handleTodoCheckbox(id, newChecked)
                    }
                    onClick={handleTodoClick}
                  />
                ))}
              </div>
            </section>

            <section className='mt-7 space-y-4 pb-20'>
              <h2 className='text-heading-sm text-black'>모음</h2>
              <div className='space-y-3'>
                {archiveItems.map(
                  ({ id, title, category, itemCount, images }) => (
                    <List.ArchiveCard
                      key={id}
                      title={title}
                      category={ARCHIVE_CATEGORY_LABEL[category]}
                      itemCount={itemCount}
                      images={images.slice(0, 4)}
                      width='w-full'
                      onClick={handleOpenTutorialArchive}
                      onEditClick={triggerLoginToast}
                      onDeleteClick={triggerLoginToast}
                    />
                  )
                )}
              </div>
            </section>
          </div>
        </main>

        {showToast && (
          <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
            <FeedBack.Toast
              message={
                toastType === 'defaultArchive'
                  ? '기본 제공 모음은 삭제할 수 없어요.'
                  : '로그인 후 간편하게 DoLink를 이용해보세요.'
              }
              actionLabel={toastType === 'login' ? '로그인' : '확인'}
              onAction={toastType === 'login' ? handleLoginClick : undefined}
              onClose={() => setShowToast(false)}
            />
          </div>
        )}

        {/* 완료 모달 */}
        {showCompleteModal && (
          <FeedBack.ModalLayout
            open={showCompleteModal}
            onClose={() => setShowCompleteModal(false)}
          >
            <FeedBack.AlertDialog
              title='할 일을 완료했어요'
              subtitle='완료한 일들은 해당 모음에서 확인할 수 있어요.'
              primaryLabel='확인'
              secondaryLabel='다시 보지 않기'
              onPrimary={() => setShowCompleteModal(false)}
              onSecondary={() => {
                setSuppressCompleteModal(true);
                setShowCompleteModal(false);
              }}
            />
          </FeedBack.ModalLayout>
        )}

        {/* 하단 고정 버튼 */}
        <FloatingButton
          aria-label='새 할 일 추가'
          className='fixed bottom-[104px] right-6 z-40'
          onClick={handleCreateTodo}
        />

        <footer className='sticky bottom-0 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
          <TabBar.BottomTabBar value='home' onChange={handleTabChange} />
        </footer>
      </Background.GradientBackground>
    </div>
  );
};

export default HomeBeforeLogin;
