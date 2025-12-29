import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Background, FeedBack, TabBar } from '@/components/common';
import { FloatingButton } from '@/components/common/button/floatingButton';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import { TAB_ROUTE_MAP } from '@/constants/routes';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { useModalStore } from '@/stores/useModalStore';
import { useTodoPreferenceStore } from '@/stores/useTodoPreferenceStore';
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
  const navigate = useNavigate();

  /**
   * 할 일 목록 상태
   * 체크박스 토글 시 checked 값 업데이트
   * 초기값 : TODO_ITEMS의 복사본
   */
  const [todoItems, setTodoItems] = useState<TodoItem[]>(() =>
    TODO_ITEMS.map((todo) => ({ ...todo }))
  );

  /**
   * 모음 목록 상태
   * 삭제 시 목록에서 항목 제거
   * 초기값: ARCHIVE_ITEMS의 복사본
   */
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>(() =>
    ARCHIVE_ITEMS.map((archive) => ({ ...archive }))
  );

  /**
   * 최신 등록 순으로 정렬한 모음 목록 (최대 8개)
   */
  const latestArchiveItems = useMemo(() => {
    const toTimestamp = (value?: string) =>
      value ? new Date(value).getTime() : 0;

    return [...archiveItems]
      .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))
      .slice(0, 8);
  }, [archiveItems]);

  /**
   * 완료 모달 표시 억제 상태 (persisted)
   * 사용자가 '다시 보지 않기'를 선택하면 true
   * 전역 Store에 저장되어 새로고침 이후에도 유지
   */
  const { suppressCompleteModal, setSuppressCompleteModal } =
    useTodoPreferenceStore();

  useEffect(() => {
    setSuppressCompleteModal(false);
  }, [setSuppressCompleteModal]);

  /**
   * 전역 모달 상태 관리 (Zustand)
   */
  const {
    isOpen: isModalOpen,
    type: modalType,
    alertConfig,
    confirmConfig,
    openAlert,
    openConfirm,
    close: closeModal,
  } = useModalStore();

  /**
   * 삭제 대기 중인 모음 ID
   * - 삭제 확인 모달에서 '삭제하기' 클릭 전까지 임시저장
   * - 확인 시: 실제 삭제 진행
   * - 취소 또는 닫기 시: null로 초기화
   */
  const [pendingDeleteArchiveId, setPendingDeleteArchiveId] = useState<
    string | null
  >(null);

  // mockData 설정
  useEffect(() => {
    setTodoItems(TODO_ITEMS.map((todo) => ({ ...todo })));
    setArchiveItems(ARCHIVE_ITEMS.map((archive) => ({ ...archive })));
  }, []);

  /**
   * 시간에 따른 인사 문구
   * useMemo() : 마운트 시점을 기준으로 한 번 계산
   */
  const greeting = useMemo(() => {
    const now = new Date();
    const period = getGreetingPeriod(now.getHours());
    return `좋은 ${period}이에요 😊`;
  }, []);

  /**
   * 할 일 토글 핸들러
   * 동작 : 해당 할 일의 checked 상태 업데이트
   */
  const handleToggleTodo = (id: string, nextChecked: boolean) => {
    // 체크 상태 업데이트
    setTodoItems((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: nextChecked } : todo
      )
    );

    // 완료 모달 표시 (조건: 완료 + 억제 안 됨)
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

  /**
   * 바텀 탭바 변경 핸들러
   * 예시
   * - home: '/'
   * - archive: '/archive'
   * - setting: '/settings'
   */

  const handleTabChange = (next: TabKey) => {
    navigate(TAB_ROUTE_MAP[next]);
  };

  /**
   * 모음 삭제 확인 핸들러
   * 동작 : Confirm 모달에서 '삭제하기' 클릭 시 실행
   */
  const handleConfirmDeleteArchive = () => {
    if (!pendingDeleteArchiveId) return;
    // 해당 모음 제거
    setArchiveItems((prev) =>
      prev.filter((archive) => archive.id !== pendingDeleteArchiveId)
    );
    // pending 상태 초기화
    setPendingDeleteArchiveId(null);
  };

  /**
   * 모음 삭제 취소 핸들러
   * 동작 : Confirm 모달에서 '취소' 클릭 시 실행
   */
  const handleCancelDeleteArchive = () => {
    setPendingDeleteArchiveId(null);
  };

  /**
   * 모음 삭제 요청 핸들러
   * 동작 : 삭제할 ID를 pending 상태에 저장
   */
  const handleRequestDeleteArchive = (id: string) => {
    // 삭제 대기 상태
    setPendingDeleteArchiveId(id);

    // 확인 모달 표시
    openConfirm({
      title: '모음을 삭제할까요?',
      subtitle: '모음 내 할 일도 함께 삭제돼요.',
      positiveLabel: '삭제하기',
      negativeLabel: '취소',
      onPositive: handleConfirmDeleteArchive, // 삭제 실행
      onNegative: handleCancelDeleteArchive, // 취소
    });
  };

  /**
   * 모달 닫기 핸들러
   * 모달 배경을 클릭 시 실행
   */
  const handleModalClose = () => {
    if (modalType === 'confirm') {
      confirmConfig?.onNegative?.();
    }
    closeModal();
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
              items={latestArchiveItems}
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
