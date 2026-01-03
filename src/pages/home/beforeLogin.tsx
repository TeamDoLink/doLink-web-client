import { useEffect, useState } from 'react';
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
import { useModalStore } from '@/stores/useModalStore';
import { getArchiveCategoryLabel } from '@/utils/archiveCategory';
import { formatRelativeDateLabel } from '@/utils/date';
import { MOCK_ARCHIVES } from '@/mocks/archiveData';
import { MOCK_TODOS } from '@/mocks/todoData';

const HomeBeforeLogin = () => {
  const { handleTabChange } = useBottomTabNavigation();
  const [showToast, setShowToast] = useState(true);
  const [todoItems, setTodoItems] = useState(() =>
    MOCK_TODOS.slice(0, 1).map((todo) => ({ ...todo }))
  );
  const [archiveItems, setArchiveItems] = useState(() =>
    MOCK_ARCHIVES.slice(0, 3).map((archive) => ({ ...archive }))
  );
  const [suppressCompleteModal, setSuppressCompleteModal] = useState(false);
  const {
    isOpen: isModalOpen,
    type: modalType,
    alertConfig,
    confirmConfig,
    openAlert,
    openConfirm,
    close: closeModal,
  } = useModalStore();
  const [pendingDeleteArchiveId, setPendingDeleteArchiveId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = () => {
    setShowToast(false);
  };

  const handleTodoCheckbox = (id: string, nextChecked: boolean) => {
    setTodoItems((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: nextChecked } : todo
      )
    );

    if (nextChecked && !suppressCompleteModal) {
      openAlert({
        title: '할 일을 완료했어요',
        subtitle: '완료한 일들은 해당 모음에서 확인할 수 있어요.',
        primaryLabel: '확인',
        secondaryLabel: '다시 보지 않기',
        onSecondary: () => setSuppressCompleteModal(true),
      });
    }
  };

  const handleConfirmDeleteArchive = () => {
    if (!pendingDeleteArchiveId) return;
    setArchiveItems((prev) =>
      prev.filter((archive) => archive.id !== pendingDeleteArchiveId)
    );
    setPendingDeleteArchiveId(null);
  };

  const handleCancelDeleteArchive = () => {
    setPendingDeleteArchiveId(null);
  };

  const handleRequestDeleteArchive = (id: string) => {
    setPendingDeleteArchiveId(id);
    openConfirm({
      title: '모음을 삭제할까요?',
      subtitle: '모음 내 할 일도 함께 삭제돼요.',
      positiveLabel: '삭제하기',
      negativeLabel: '취소',
      onPositive: handleConfirmDeleteArchive,
      onNegative: handleCancelDeleteArchive,
    });
  };

  const handleModalClose = () => {
    if (modalType === 'confirm') {
      confirmConfig?.onNegative?.();
    }
    closeModal();
  };

  return (
    <div className='relative flex min-h-screen flex-col'>
      <Background.GradientBackground className='flex min-h-0 flex-1 flex-col'>
        <header className='sticky top-0 z-20'>
          <HomeAppBar />
        </header>

        <main className='relative grow'>
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
                      onChange={(next) => handleTodoCheckbox(id, next)}
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
                      category={getArchiveCategoryLabel(category)}
                      itemCount={itemCount}
                      images={images}
                      width='w-full'
                      onDeleteClick={() => handleRequestDeleteArchive(id)}
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
              message='로그인 후 간편하게 DoLink를 이용해보세요.'
              actionLabel='로그인'
              onAction={handleLoginClick}
            />
          </div>
        )}

        <footer className='sticky bottom-0 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
          <div className='relative w-full'>
            <div className='pointer-events-none absolute -top-[76px] right-6 z-10 flex h-[52px] w-[52px] items-center justify-center'>
              <FloatingButton
                aria-label='새 할 일 추가'
                className='pointer-events-auto'
              />
            </div>
            <TabBar.BottomTabBar value='home' onChange={handleTabChange} />
          </div>
        </footer>

        <FeedBack.ModalLayout open={isModalOpen} onClose={handleModalClose}>
          {modalType === 'alert' && alertConfig && (
            <FeedBack.AlertDialog
              title={alertConfig.title}
              subtitle={alertConfig.subtitle}
              primaryLabel={alertConfig.primaryLabel}
              secondaryLabel={alertConfig.secondaryLabel}
              onPrimary={() => {
                alertConfig.onPrimary?.();
                closeModal();
              }}
              onSecondary={
                alertConfig.secondaryLabel
                  ? () => {
                      alertConfig.onSecondary?.();
                      closeModal();
                    }
                  : undefined
              }
            />
          )}
          {modalType === 'confirm' && confirmConfig && (
            <FeedBack.ConfirmDialog
              title={confirmConfig.title}
              subtitle={confirmConfig.subtitle}
              positiveLabel={confirmConfig.positiveLabel}
              negativeLabel={confirmConfig.negativeLabel}
              onPositive={() => {
                confirmConfig.onPositive?.();
                closeModal();
              }}
              onNegative={() => {
                confirmConfig.onNegative?.();
                closeModal();
              }}
            />
          )}
        </FeedBack.ModalLayout>
      </Background.GradientBackground>
    </div>
  );
};

export default HomeBeforeLogin;
