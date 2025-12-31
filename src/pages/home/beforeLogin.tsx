import { useEffect, useState } from 'react';
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
import { TAB_ROUTE_MAP } from '@/constants/routes';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { FloatingButton } from '@/components/common/button';
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
];

const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 'tutorial',
    title: '두링크(DoLink) 튜토리얼',
    category: '기타',
    itemCount: 1,
    createdAt: '2025-01-07T16:45:00',
  },
];

const HomeBeforeLogin = () => {
  const navigate = useNavigate();
  /**
   * 로그인 토스트 상태
   * 초기값 : true
   * 3초 후 자동 false
   * 로그인 버튼 클릭 시 즉시 false
   */
  const [showToast, setShowToast] = useState(true);

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

  // 로그인 모달 지속시간 3초
  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * 할 일 토글 핸들러
   * 동작 : 해당 할 일의 checked 상태 업데이트
   */
  const handleTodoCheckbox = (id: string, nextChecked: boolean) => {
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
      onPositive: handleConfirmDeleteArchive,
      onNegative: handleCancelDeleteArchive,
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
      <Background.GradientBackground className='flex min-h-0 flex-1 flex-col'>
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
                <p className='text-heading-sm text-grey-500'>
                  만나서 반가워요 😊
                </p>
                <h1 className='text-display-2xl text-black'>
                  두링크가 처음이라면
                </h1>
                <Button.IconButton
                  label='로그인하기'
                  className='mt-3 text-body-md'
                />
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
              <div className='space-y-4 rounded-2xl bg-white py-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)]'>
                {todoItems.map(({ id, title, date, platform, checked }) => (
                  <List.TodoItem
                    key={id}
                    title={title}
                    subtitle={`${date} · ${platform}`}
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
                {archiveItems.map(
                  ({ id, title, category, itemCount, images }) => (
                    <List.ArchiveCard
                      key={id}
                      title={title}
                      category={category}
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

        {/* 로그인 토스트 */}
        {showToast && (
          <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
            <FeedBack.Toast
              message='로그인 후 간편하게 DoLink를 이용해보세요.'
              actionLabel='로그인'
              onAction={() => setShowToast(false)}
            />
          </div>
        )}

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
      </Background.GradientBackground>
    </div>
  );
};

export default HomeBeforeLogin;
