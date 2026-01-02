import { useMemo, useState } from 'react';
import { Background, FeedBack, TabBar } from '@/components/common';
import { FloatingButton } from '@/components/common/button';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import { GreetingSection } from '@/components/home/greetingSection';
import { TodoSection } from '@/components/home/todoSection';
import { ArchiveSection } from '@/components/home/archiveSection';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import { useModalStore } from '@/stores/useModalStore';
import { useTodoPreferenceStore } from '@/stores/useTodoPreferenceStore';
import type { ArchiveItem, TodoItem } from '@/types';

const TODO_ITEMS: TodoItem[] = [
  {
    id: 'welcome-guide',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    platform: '노션 (Notion)',
    checked: false,
  },
  {
    id: 'welcome-guide-2',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    platform: '노션 (Notion)',
    checked: false,
  },
  {
    id: 'welcome-guide-3',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    platform: '노션 (Notion)',
    checked: false,
  },
  {
    id: 'welcome-guide-4',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    platform: '노션 (Notion)',
    checked: false,
  },
  {
    id: 'welcome-guide-5',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    platform: '노션 (Notion)',
    checked: false,
  },
];

const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 'tutorial-4',
    title: '두링크(DoLink) 튜토리얼 (01/07)',
    category: '기타',
    itemCount: 3,
    createdAt: '2025-01-07T16:45:00',
  },
  {
    id: 'tutorial-5',
    title: '두링크(DoLink) 튜토리얼 (12/31)',
    category: '기타',
    itemCount: 1,
    createdAt: '2024-12-31T17:30:28',
  },
  {
    id: 'tutorial-2',
    title: '두링크(DoLink) 튜토리얼 (01/09)',
    category: '기타',
    itemCount: 2,
    createdAt: '2025-01-09T14:20:15',
  },
  {
    id: 'tutorial-3',
    title: '두링크(DoLink) 튜토리얼 (01/05)',
    category: '기타',
    itemCount: 4,
    createdAt: '2025-01-05T13:25:10',
  },
  {
    id: 'tutorial',
    title: '두링크(DoLink) 튜토리얼 (01/10)',
    category: '기타',
    itemCount: 1,
    createdAt: '2025-01-10T12:30:21',
  },
  {
    id: 'tutorial-5',
    title: '두링크(DoLink) 튜토리얼 (01/03)',
    category: '기타',
    itemCount: 1,
    createdAt: '2025-01-03T15:40:33',
  },
  {
    id: 'tutorial-4',
    title: '두링크(DoLink) 튜토리얼 (01/01)',
    category: '기타',
    itemCount: 3,
    createdAt: '2025-01-01T12:10:55',
  },
  {
    id: 'tutorial-3',
    title: '두링크(DoLink) 튜토리얼 (01/08)',
    category: '기타',
    itemCount: 4,
    createdAt: '2025-01-08T09:15:30',
  },
  {
    id: 'tutorial-5',
    title: '두링크(DoLink) 튜토리얼 (01/06)',
    category: '기타',
    itemCount: 1,
    createdAt: '2025-01-06T11:30:22',
  },
  {
    id: 'tutorial-3',
    title: '두링크(DoLink) 튜토리얼 (01/02)',
    category: '기타',
    itemCount: 4,
    createdAt: '2025-01-02T08:20:17',
  },
  {
    id: 'tutorial-4',
    title: '두링크(DoLink) 튜토리얼 (01/04)',
    category: '기타',
    itemCount: 3,
    createdAt: '2025-01-04T10:15:45',
  },
];

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
  const { handleTabChange } = useBottomTabNavigation();
  const { suppressCompleteModal, setSuppressCompleteModal } =
    useTodoPreferenceStore();
  const {
    isOpen: isModalOpen,
    type: modalType,
    alertConfig,
    confirmConfig,
    openAlert,
    openConfirm,
    close: closeModal,
  } = useModalStore();
  const [todoItems, setTodoItems] = useState<TodoItem[]>(() =>
    TODO_ITEMS.map((todo) => ({ ...todo }))
  );
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>(() =>
    ARCHIVE_ITEMS.map((archive) => ({ ...archive }))
  );
  const [pendingDeleteArchiveId, setPendingDeleteArchiveId] = useState<
    string | null
  >(null);

  const greeting = useMemo(() => {
    const now = new Date();
    const period = getGreetingPeriod(now.getHours());
    return `좋은 ${period}이에요 😊`;
  }, []);

  const latestArchiveItems = useMemo(() => {
    return [...archiveItems].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [archiveItems]);

  const handleToggleTodo = (id: string, nextChecked: boolean) => {
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
