import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Background, FeedBack, TabBar } from '@/components/common';
import { FloatingButton } from '@/components/common/button';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import { GreetingSection } from '@/components/home/greetingSection';
import { TodoSection } from '@/components/home/todoSection';
import { ArchiveSection } from '@/components/home/archiveSection';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import { useModalStore } from '@/stores/useModalStore';
import { useArchiveMockStore } from '@/stores/useArchiveMockStore';
import { MOCK_TODOS } from '@/mocks/todoData';
import {
  getArchiveCategoryLabel,
  toEditorCategory,
} from '@/utils/archiveCategory';
import { ROUTES } from '@/constants/routes';

// 시간 계산 함수
const getGreetingPeriod = (hour: number) => {
  if (hour >= 5 && hour < 11) return '아침';
  if (hour >= 11 && hour < 16) return '점심';
  if (hour >= 16 && hour < 20) return '저녁';
  return '밤';
};

type HomeAfterLoginProps = {
  memberName?: string;
};

const HomeAfterLogin = ({ memberName = '이니닝' }: HomeAfterLoginProps) => {
  const navigate = useNavigate();
  const { handleTabChange } = useBottomTabNavigation();
  const [suppressCompleteModal, setSuppressCompleteModal] = useState(false);
  const [todoItems, setTodoItems] = useState(() =>
    MOCK_TODOS.map((todo) => ({ ...todo }))
  );
  const archiveItems = useArchiveMockStore((state) => state.archives);
  const deleteArchive = useArchiveMockStore((state) => state.deleteArchive);
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

  const greeting = useMemo(() => {
    const now = new Date();
    const period = getGreetingPeriod(now.getHours());
    return `좋은 ${period}이에요 😊`;
  }, []);

  const latestArchiveItems = useMemo(() => {
    return archiveItems
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((archive) => ({
        id: archive.id,
        title: archive.title,
        category: getArchiveCategoryLabel(archive.category),
        itemCount: archive.itemCount,
        images: archive.images,
        createdAt: archive.createdAt,
      }));
  }, [archiveItems]);

  const handleToggleTodo = (id: string, nextChecked: boolean) => {
    setTodoItems((prevTodos) =>
      prevTodos.map((todo) =>
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
    deleteArchive(pendingDeleteArchiveId);
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

  const handleRequestEditArchive = (id: string) => {
    const targetArchive = archiveItems.find((archive) => archive.id === id);
    if (!targetArchive) {
      return;
    }

    navigate(ROUTES.archiveEdit, {
      state: {
        archive: {
          id: targetArchive.id,
          title: targetArchive.title,
          category: toEditorCategory(targetArchive.category),
        },
        origin: ROUTES.home,
      },
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
      <Background.GradientBackground>
        <header className='sticky top-0 z-20'>
          <HomeAppBar />
        </header>

        <main className='relative grow'>
          <div className='mx-auto flex flex-col px-5 py-2'>
            <GreetingSection memberName={memberName} greeting={greeting} />
            <TodoSection items={todoItems} onToggle={handleToggleTodo} />
            <ArchiveSection
              items={latestArchiveItems}
              onRequestDelete={handleRequestDeleteArchive}
              onRequestEdit={handleRequestEditArchive}
            />
          </div>
        </main>
      </Background.GradientBackground>

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
    </div>
  );
};

export default HomeAfterLogin;
