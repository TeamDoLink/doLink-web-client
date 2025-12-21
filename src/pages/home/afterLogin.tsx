import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Background, FeedBack, TabBar } from '@/components/common';
import { FloatingButton } from '@/components/common/button/floatingButton';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import { TAB_ROUTE_MAP } from '@/constants/routes';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { useTodoStore } from '@/stores/useTodoStore';
import { GreetingSection } from '@/components/home/greetingSection';
import { TodoSection } from '@/components/home/todoSection';
import { ArchiveSection } from '@/components/home/archiveSection';
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
    id: 'tutorial',
    title: '두링크(DoLink) 튜토리얼',
    category: '기타',
    itemCount: 1,
  },
  {
    id: 'tutorial-2',
    title: '두링크(DoLink) 튜토리얼',
    category: '기타',
    itemCount: 2,
  },
  {
    id: 'tutorial-3',
    title: '두링크(DoLink) 튜토리얼',
    category: '기타',
    itemCount: 4,
  },
  {
    id: 'tutorial-4',
    title: '두링크(DoLink) 튜토리얼',
    category: '기타',
    itemCount: 3,
  },
  {
    id: 'tutorial-5',
    title: '두링크(DoLink) 튜토리얼',
    category: '기타',
    itemCount: 1,
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
  const navigate = useNavigate();

  const [todoItems, setTodoItems] = useState<TodoItem[]>(() =>
    TODO_ITEMS.map((todo) => ({ ...todo }))
  );
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>(() =>
    ARCHIVE_ITEMS.map((archive) => ({ ...archive }))
  );
  const {
    showCompleteModal,
    suppressCompleteModal,
    setShowCompleteModal,
    setSuppressCompleteModal,
  } = useTodoStore();
  const [pendingDeleteArchiveId, setPendingDeleteArchiveId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setTodoItems(TODO_ITEMS.map((todo) => ({ ...todo })));
    setArchiveItems(ARCHIVE_ITEMS.map((archive) => ({ ...archive })));
  }, []);

  // 시간에 따른 인사 문구
  const greeting = useMemo(() => {
    const now = new Date();
    const period = getGreetingPeriod(now.getHours());
    return `좋은 ${period}이에요 😊`;
  }, []);

  const handleCloseModal = () => {
    setShowCompleteModal(false);
  };

  const handleDisableModal = () => {
    setSuppressCompleteModal(true);
    setShowCompleteModal(false);
  };

  const handleToggleTodo = (id: string, nextChecked: boolean) => {
    setTodoItems((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: nextChecked } : todo
      )
    );

    if (nextChecked && !suppressCompleteModal) {
      setShowCompleteModal(true);
    }
  };

  // 바텀 탭바 함수
  const handleTabChange = (next: TabKey) => {
    navigate(TAB_ROUTE_MAP[next]);
  };

  const handleRequestDeleteArchive = (id: string) => {
    setPendingDeleteArchiveId(id);
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

  return (
    <div className='relative flex min-h-screen flex-col'>
      <Background.GradientBackground>
        {/* 앱바 헤더 */}
        <header className='sticky top-0 z-20'>
          <HomeAppBar />
        </header>

        {/* 메인 컨텐츠 */}
        <main className='relative grow'>
          <div className='mx-auto flex flex-col px-5 py-2'>
            {/* 상단 문구 + 일러스트 */}
            <GreetingSection memberName={memberName} greeting={greeting} />
            {/* 하단 할 일 */}
            <TodoSection items={todoItems} onToggle={handleToggleTodo} />
            {/* 하단 모음 */}
            <ArchiveSection
              items={archiveItems}
              onRequestDelete={handleRequestDeleteArchive}
            />
          </div>
        </main>
      </Background.GradientBackground>

      {/* 바텀 탭바 */}
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

      {/* 할 일 완료 모달 */}
      <FeedBack.ModalLayout open={showCompleteModal} onClose={handleCloseModal}>
        <FeedBack.AlertDialog
          title='할 일을 완료했어요'
          subtitle='완료한 일들은 해당 모음에서 확인할 수 있어요.'
          primaryLabel='확인'
          secondaryLabel='다시 보지 않기'
          onPrimary={handleCloseModal}
          onSecondary={handleDisableModal}
        />
      </FeedBack.ModalLayout>

      {/* 모음 삭제 모달 */}
      <FeedBack.ModalLayout
        open={pendingDeleteArchiveId !== null}
        onClose={handleCancelDeleteArchive}
      >
        <FeedBack.ConfirmDialog
          title='모음을 삭제할까요?'
          subtitle='모음 내 할 일도 함께 삭제돼요.'
          positiveLabel='삭제하기'
          negativeLabel='취소'
          onPositive={handleConfirmDeleteArchive}
          onNegative={handleCancelDeleteArchive}
        />
      </FeedBack.ModalLayout>
    </div>
  );
};

export default HomeAfterLogin;
