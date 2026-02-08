import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Background, FeedBack, TabBar } from '@/components/common';
import { FloatingButton } from '@/components/common/button';
import { HomeAppBar } from '@/components/common/appBar/homeAppBar';
import { GreetingSection } from '@/components/home/greetingSection';
import { TodoSection } from '@/components/home/todoSection';
import { ArchiveSection } from '@/components/home/archiveSection';
import { useBottomTabNavigation } from '@/hooks/useBottomTabNavigation';
import { useModalStore } from '@/stores/useModalStore';
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';
import { ROUTES } from '@/constants/routes';
import {
  useListRecent,
  getListRecentQueryKey,
  useCompleteTask,
} from '@/api/generated/endpoints/task/task';
import {
  useListAll1 as useListAll,
  useDeleteCollect,
  getListAll1QueryKey as getListAllQueryKey,
  getListByCategoryQueryKey,
} from '@/api/generated/endpoints/collection/collection';
import { useGetUser } from '@/api/generated/endpoints/user/user';
import type {
  ApiResponseListTaskResponse,
  ApiResponseSliceCollectionResponse,
  ApiResponseUserResponse,
} from '@/api/generated/models';
import {
  ARCHIVE_CATEGORY_LABEL,
  type ArchiveCategoryKey,
} from '@/utils/archiveCategory';
import type { TodoItem } from '@/types';

// Korean category label → English key 역매핑
const CATEGORY_LABEL_TO_KEY = Object.fromEntries(
  Object.entries(ARCHIVE_CATEGORY_LABEL)
    .filter(([key]) => key !== 'all')
    .map(([key, label]) => [label, key])
) as Record<string, ArchiveCategoryKey>;

// URL에서 도메인 추출
const extractDomain = (url: string | undefined | null): string => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// 시간 계산 함수
const getGreetingPeriod = (hour: number) => {
  if (hour >= 5 && hour < 11) return '아침';
  if (hour >= 11 && hour < 16) return '점심';
  if (hour >= 16 && hour < 20) return '저녁';
  return '밤';
};

const HomeAfterLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleTabChange } = useBottomTabNavigation();
  const [suppressCompleteModal, setSuppressCompleteModal] = useState(false);
  const [todoOverrides, setTodoOverrides] = useState<Record<string, boolean>>(
    {}
  );

  // API: 사용자 프로필
  const { data: userData } = useGetUser();
  const userResponse = (userData as unknown as ApiResponseUserResponse)?.result;
  const memberName =
    userResponse?.nickname ?? userResponse?.socialName ?? '사용자';

  // API: 최근 할 일
  const { data: recentData } = useListRecent({ limit: 3 });
  const recentTasks =
    (recentData as unknown as ApiResponseListTaskResponse)?.result ?? [];

  // API: 모음 목록
  const { data: archiveData } = useListAll({ page: 0, size: 8 });
  const archiveSlice = (
    archiveData as unknown as ApiResponseSliceCollectionResponse
  )?.result;
  const archiveContent = archiveSlice?.content ?? [];

  // Mutations
  const { mutate: completeTask } = useCompleteTask();
  const { mutate: deleteCollect } = useDeleteCollect();

  const setSelectedArchiveId = useArchiveUIStore(
    (state) => state.setSelectedArchiveId
  );
  const {
    isOpen: isModalOpen,
    type: modalType,
    alertConfig,
    confirmConfig,
    openAlert,
    openConfirm,
    close: closeModal,
  } = useModalStore();

  const greeting = useMemo(() => {
    const now = new Date();
    const period = getGreetingPeriod(now.getHours());
    return `좋은 ${period}이에요 😊`;
  }, []);

  // API 응답 → TodoItem[] 매핑
  const latestTodos: TodoItem[] = useMemo(() => {
    return recentTasks.map((t) => ({
      id: String(t.taskId ?? 0),
      title: t.title ?? '',
      platform: extractDomain(t.link),
      checked: todoOverrides[String(t.taskId ?? 0)] ?? t.status ?? false,
      createdAt: t.createdAt ?? new Date().toISOString(),
    }));
  }, [recentTasks, todoOverrides]);

  // API 응답 → ArchiveSectionItem[] 매핑
  const latestArchives = useMemo(() => {
    return archiveContent.map((a) => ({
      id: String(a.collectionId ?? 0),
      title: a.name ?? '',
      category: CATEGORY_LABEL_TO_KEY[a.category ?? ''] ?? 'etc',
      itemCount: 0,
      previewImages: Array.isArray(a.thumbnails)
        ? a.thumbnails.slice(0, 4)
        : [],
      createdAt: '',
    }));
  }, [archiveContent]);

  const handleToggleTodo = (id: string, nextChecked: boolean) => {
    setTodoOverrides((prev) => ({ ...prev, [id]: nextChecked }));
    completeTask(
      { taskId: Number(id) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListRecentQueryKey(),
          });
          setTodoOverrides({});
          if (nextChecked && !suppressCompleteModal) {
            openAlert({
              title: '할 일을 완료했어요',
              subtitle: '완료한 일들은 해당 모음에서 확인할 수 있어요.',
              primaryLabel: '확인',
              secondaryLabel: '다시 보지 않기',
              onSecondary: () => setSuppressCompleteModal(true),
            });
          }
        },
        onError: () => {
          setTodoOverrides((prev) => ({ ...prev, [id]: !nextChecked }));
        },
      }
    );
  };

  const handleRequestDeleteArchive = (id: string) => {
    openConfirm({
      title: '모음을 삭제할까요?',
      subtitle: '모음 내 할 일도 함께 삭제돼요.',
      positiveLabel: '삭제하기',
      negativeLabel: '취소',
      onPositive: () => {
        deleteCollect(
          { collectId: Number(id) },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: getListAllQueryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: getListByCategoryQueryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: getListRecentQueryKey(),
              });
              setSelectedArchiveId(null);
              closeModal();
            },
          }
        );
      },
      onNegative: closeModal,
    });
  };

  const handleRequestEditArchive = (id: string) => {
    setSelectedArchiveId(id);
    navigate(`${ROUTES.archiveEdit}/${id}`);
  };

  const handleModalClose = () => {
    if (modalType === 'confirm') {
      confirmConfig?.onNegative?.();
    }
    closeModal();
  };

  const handleCreateTodo = () => {
    navigate(ROUTES.taskCreate);
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
            <TodoSection items={latestTodos} onToggle={handleToggleTodo} />
            <ArchiveSection
              items={latestArchives}
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
              onClick={handleCreateTodo}
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
