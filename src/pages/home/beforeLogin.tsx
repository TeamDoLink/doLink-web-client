import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Background,
  Button,
  FeedBack,
  List,
  TabBar,
} from '@/components/common';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import heroIllustration from '@/assets/icons/home/home1.svg';
import { FloatingButton } from '@/components/common/button';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import {
  BEFORE_LOGIN_ARCHIVE,
  BEFORE_LOGIN_TODO,
} from '@/constants/beforeLoginData';
import { ROUTES } from '@/constants/routes';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';
import { formatRelativeDateLabel } from '@/utils/date';

const HomeBeforeLogin = () => {
  const navigate = useNavigate();
  const { handleTabChange } = useBottomTabNavigation();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'login' | 'defaultArchive' | null>(
    null
  );
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

  const triggerDefaultArchiveToast = () => {
    showToastWithType('defaultArchive');
  };

  const handleTodoCheckbox = () => {
    triggerLoginToast();
  };

  const handleCreateTodo = () => {
    triggerLoginToast();
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
          <div className='mx-auto flex flex-col px-5 py-2'>
            <section className='flex items-center justify-between'>
              <div className='flex flex-col gap-1'>
                <p className='text-heading-sm text-grey-500'>
                  만나서 반가워요 😊
                </p>
                <h1 className='text-display-2xl text-black'>
                  두링크가 처음이라면
                </h1>
                <Button.IconButton
                  label='로그인하기'
                  className='mt-3 text-body-md'
                  onClick={handleLoginClick}
                />
              </div>
              <img
                src={heroIllustration}
                alt='홈 일러스트'
                className='h-[120px] w-[130px] flex-shrink-0 object-contain'
              />
            </section>

            <section className='mt-5 space-y-4'>
              <h2 className='text-heading-sm text-black'>할 일</h2>
              <div className='space-y-4 rounded-2xl bg-white py-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)]'>
                {todoItems.map(
                  ({ id, title, platform, checked, createdAt }) => (
                    <List.TodoItem
                      key={id}
                      title={title}
                      subtitle={`${formatRelativeDateLabel(createdAt)} · ${platform}`}
                      checked={checked}
                      onChange={handleTodoCheckbox}
                    />
                  )
                )}
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
                      disableActionMenu
                      onClick={handleOpenTutorialArchive}
                      onMoreClick={triggerDefaultArchiveToast}
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
              actionLabel={toastType === 'defaultArchive' ? '확인' : '로그인'}
              onAction={
                toastType === 'defaultArchive'
                  ? () => setShowToast(false)
                  : handleLoginClick
              }
            />
          </div>
        )}

        <footer className='sticky bottom-0 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
          <div className='relative w-full'>
            <div className='pointer-events-none absolute -top-[76px] right-6 z-10 flex h-[52px] w-[52px] items-center justify-center'>
              <FloatingButton
                aria-label='새 할 일 추가'
                className='pointer-events-auto'
                onClick={handleCreateTodo}
              />
            </div>
            <TabBar.BottomTabBar value='home' onChange={handleTabChange} />
          </div>
        </footer>
      </Background.GradientBackground>
    </div>
  );
};

export default HomeBeforeLogin;
