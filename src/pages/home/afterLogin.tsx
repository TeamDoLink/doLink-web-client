import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Background, FeedBack, List, TabBar } from '@/components/common';
import { FloatingButton } from '@/components/common/button/floatingButton';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import heroIllustration from '@/assets/icons/home/home2.svg';
import { TAB_ROUTE_MAP } from '@/constants/routes';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { useTodoStore, type TodoItem } from '@/stores/useTodoStore';
import { useFolderStore, type FolderItem } from '@/stores/useFolderStore';

const TODO_ITEMS: TodoItem[] = [
  {
    id: 'welcome-guide',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    sns: '노션 (Notion)',
    checked: false,
  },
  {
    id: 'welcome-guide-2',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    sns: '노션 (Notion)',
    checked: false,
  },
  {
    id: 'welcome-guide-3',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    sns: '노션 (Notion)',
    checked: false,
  },
  {
    id: 'welcome-guide-4',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    sns: '노션 (Notion)',
    checked: false,
  },
  {
    id: 'welcome-guide-5',
    title: '두링크(DoLink) 안내서 📚',
    date: '오늘',
    sns: '노션 (Notion)',
    checked: false,
  },
];

const FOLDER_ITEMS: FolderItem[] = [
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
  const {
    items: todoItems,
    toggleTodo,
    showCompleteModal,
    setShowCompleteModal,
    setSuppressCompleteModal,
    resetTodos,
  } = useTodoStore();
  const {
    items: folderItems,
    pendingDeleteFolderId,
    setPendingDeleteFolderId,
    removeFolder,
    resetFolders,
  } = useFolderStore();

  useEffect(() => {
    resetTodos(TODO_ITEMS);
    resetFolders(FOLDER_ITEMS);
  }, [resetFolders, resetTodos]);

  // 시간에 따른 인사 문구
  const greeting = useMemo(() => {
    const now = new Date();
    const period = getGreetingPeriod(now.getHours());
    return `좋은 ${period}이에요 😊`;
  }, []);

  // 할 일의 체크 여부를 바꿔주는 함수
  const handleTodoCheckbox = (id: string, nextChecked: boolean) => {
    toggleTodo(id, nextChecked);
  };

  const handleCloseModal = () => {
    setShowCompleteModal(false);
  };

  const handleDisableModal = () => {
    setSuppressCompleteModal(true);
    setShowCompleteModal(false);
  };

  // 바텀 탭바 함수
  const handleTabChange = (next: TabKey) => {
    navigate(TAB_ROUTE_MAP[next]);
  };

  const handleRequestDeleteFolder = (id: string) => {
    setPendingDeleteFolderId(id);
  };

  const handleConfirmDeleteFolder = () => {
    if (!pendingDeleteFolderId) return;
    removeFolder(pendingDeleteFolderId);
  };

  const handleCancelDeleteFolder = () => {
    setPendingDeleteFolderId(null);
  };

  return (
    <div className='relative flex min-h-screen flex-col'>
      <Background.GradientBackground />

      {/* 앱바 헤더 */}
      <header className='sticky top-0 z-20'>
        <HomeAppBar />
      </header>

      {/* 메인 컨텐츠 */}
      <main className='relative grow'>
        <div className='mx-auto flex flex-col px-5 py-2'>
          {/* 상단 문구 + 일러스트 */}
          <section className='flex items-center justify-between'>
            {/* 문구 */}
            <div className='flex flex-col gap-1'>
              <p className='text-heading-sm text-grey-500'>{greeting}</p>
              <h1 className='text-display-2xl text-black'>
                만나서 반가워요
                <br />
                <span className='text-display-2xl text-black'>
                  {memberName}님
                </span>
              </h1>
            </div>
            {/* 일러스트 */}
            <img
              src={heroIllustration}
              alt='홈 일러스트'
              className='h-[120px] w-[130px] flex-shrink-0 object-contain'
            />
          </section>

          {/* 하단 할 일 */}
          <section className='mt-5 space-y-4'>
            <h2 className='text-heading-sm text-black'>할 일</h2>
            <div className='space-y-4 rounded-2xl bg-white py-5 shadow-[0_12px_24px_rgba(18,30,64,0.08)]'>
              {todoItems.map(({ id, title, date, sns, checked }) => (
                <List.TodoItem
                  key={id}
                  title={title}
                  subtitle={`${date} · ${sns}`}
                  checked={checked}
                  onChange={(next) => handleTodoCheckbox(id, next)}
                />
              ))}
            </div>
          </section>

          {/* 하단 모음 */}
          <section className='mt-7 space-y-4 pb-20'>
            <h2 className='text-heading-sm text-black'>모음</h2>
            <div className='space-y-3'>
              {folderItems.map(({ id, title, category, itemCount, images }) => (
                <List.ArchiveCard
                  key={id}
                  title={title}
                  category={category}
                  itemCount={itemCount}
                  images={images}
                  width='w-full'
                  onDeleteClick={() => handleRequestDeleteFolder(id)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

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
        open={pendingDeleteFolderId !== null}
        onClose={handleCancelDeleteFolder}
      >
        <FeedBack.ConfirmDialog
          title='모음을 삭제할까요?'
          subtitle='모음 내 할 일도 함께 삭제돼요.'
          positiveLabel='삭제하기'
          negativeLabel='취소'
          onPositive={handleConfirmDeleteFolder}
          onNegative={handleCancelDeleteFolder}
        />
      </FeedBack.ModalLayout>
    </div>
  );
};

export default HomeAfterLogin;
