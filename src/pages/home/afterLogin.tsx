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
import { useToast } from '@/hooks/useToast';
import { useModalStore } from '@/stores/useModalStore';
import { ROUTES } from '@/constants/routes';
import {
  useListRecent,
  getListRecentQueryKey,
  useCompleteTask,
} from '@/api/generated/endpoints/task/task';
import {
  useListTop8,
  useDeleteCollect,
  getListTop8QueryKey,
  getListByCategoryQueryKey,
  useGetMostTasksCategory,
} from '@/api/generated/endpoints/collection/collection';
import { useGetUser } from '@/api/generated/endpoints/user/user';
import type {
  ApiResponseListTaskResponse,
  ApiResponseListCollectionResponse,
  ApiResponseUserResponse,
  ApiResponseMostTasksCategoryResponse,
} from '@/api/generated/models';
import {
  ARCHIVE_CATEGORY_LABEL,
  type ArchiveCategoryKey,
} from '@/utils/archiveCategory';
import type { TodoItem } from '@/types';
// 카테고리 아이콘 import
import restaurantIcon from '@/assets/icons/home/restaurant.svg';
import hobbyIcon from '@/assets/icons/home/hobby.svg';
import travelIcon from '@/assets/icons/home/travel.svg';
import moneyIcon from '@/assets/icons/home/money.svg';
import shoppingIcon from '@/assets/icons/home/shopping.svg';
import exerciseIcon from '@/assets/icons/home/exercise.svg';
import careerIcon from '@/assets/icons/home/career.svg';
import studyIcon from '@/assets/icons/home/study.svg';
import tipsIcon from '@/assets/icons/home/tips.svg';
import etcIcon from '@/assets/icons/home/etc.svg';
import defaultIcon from '@/assets/icons/home/home2.svg';

// Korean category label → English key 역매핑
const CATEGORY_LABEL_TO_KEY = Object.fromEntries(
  Object.entries(ARCHIVE_CATEGORY_LABEL)
    .filter(([key]) => key !== 'all')
    .map(([key, label]) => [label, key])
) as Record<string, ArchiveCategoryKey>;

// 카테고리별 문구 매핑
const getCategoryGreeting = (categoryKorean: string | null | undefined) => {
  if (!categoryKorean) {
    return {
      main: '만나서 반가워요!',
      sub: '새 친구',
    };
  }

  const greetingMap: Record<string, { main: string; sub: string }> = {
    맛집: { main: '쩝쩝박사는 역시 달라요!', sub: '푸드파이터' },
    취미: { main: '인사이트가 넘쳐나요!', sub: '취미부자' },
    여행: { main: '새로운 곳으로 떠나봐요!', sub: '프로여행러' },
    재테크: { main: '재테크에 진심이예요!', sub: '알뜰살뜰' },
    쇼핑: { main: '추구미는 풀소유군요!', sub: '지름신강림' },
    운동: { main: '건강하게 운동해요!', sub: '운동장인' },
    커리어: { main: '커리어를 쌓아가요!', sub: '갓생사는' },
    자기개발: { main: '몸과 마음을 수양해요!', sub: '자기계발러' },
    꿀팁: { main: '유용한 팁이 가득해요!', sub: '꿀팁가득' },
    기타: { main: '호기심이 넘쳐나요!', sub: '프로수집러' },
  };

  return (
    greetingMap[categoryKorean] || { main: '만나서 반가워요!', sub: '새 친구' }
  );
};

// 카테고리별 아이콘 매핑
const getCategoryIcon = (categoryKorean: string | null | undefined) => {
  if (!categoryKorean) {
    return defaultIcon;
  }

  const iconMap: Record<string, string> = {
    맛집: restaurantIcon,
    취미: hobbyIcon,
    여행: travelIcon,
    재테크: moneyIcon,
    쇼핑: shoppingIcon,
    운동: exerciseIcon,
    커리어: careerIcon,
    자기개발: studyIcon,
    꿀팁: tipsIcon,
    기타: etcIcon,
  };

  return iconMap[categoryKorean] || defaultIcon;
};

const HomeAfterLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleTabChange } = useBottomTabNavigation();
  const [suppressCompleteModal, setSuppressCompleteModal] = useState(false);
  const [todoOverrides, setTodoOverrides] = useState<Record<string, boolean>>(
    {}
  );
  const tutorialToast = useToast();

  // API: 사용자 프로필
  const { data: userData } = useGetUser();
  const userResponse = (userData as unknown as ApiResponseUserResponse)?.result;
  const memberName =
    userResponse?.nickname ?? userResponse?.socialName ?? '사용자';

  // API: 최근 할 일
  const { data: recentData } = useListRecent({ limit: 3 });
  const recentTasks =
    (recentData as unknown as ApiResponseListTaskResponse)?.result ?? [];

  // API: 모음 목록 (최근 8개)
  const { data: archiveData } = useListTop8();
  const archiveResult = (
    archiveData as unknown as ApiResponseListCollectionResponse
  )?.result;
  const archiveContent = archiveResult ?? [];

  // API: 가장 많은 할 일이 있는 카테고리
  const { data: mostTasksCategoryData } = useGetMostTasksCategory();
  const mostTasksCategory = (
    mostTasksCategoryData as unknown as ApiResponseMostTasksCategoryResponse
  )?.result;

  // Mutations
  const { mutate: completeTask } = useCompleteTask();
  const { mutate: deleteCollect } = useDeleteCollect();

  const {
    isOpen: isModalOpen,
    type: modalType,
    alertConfig,
    confirmConfig,
    openAlert,
    openConfirm,
    close: closeModal,
  } = useModalStore();

  // 카테고리 기반 문구 생성
  const categoryGreeting = useMemo(() => {
    return getCategoryGreeting(mostTasksCategory?.categoryKorean);
  }, [mostTasksCategory]);

  // 카테고리 기반 아이콘 생성
  const categoryIcon = useMemo(() => {
    return getCategoryIcon(mostTasksCategory?.categoryKorean);
  }, [mostTasksCategory]);

  // API 응답 → TodoItem[] 매핑
  const latestTodos: TodoItem[] = useMemo(() => {
    return recentTasks.map((t) => ({
      id: String(t.taskId ?? 0),
      title: t.title ?? '',
      platform: t.domain ?? '',
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
      itemCount: a.taskCount ?? 0,
      previewImages: Array.isArray(a.thumbnails)
        ? a.thumbnails.slice(0, 4)
        : [],
      createdAt: '',
      isTutorial: a.isTutorial ?? false,
    }));
  }, [archiveContent]);

  const handleToggleTodo = (id: string, nextChecked: boolean) => {
    setTodoOverrides((prev) => ({ ...prev, [id]: nextChecked }));
    completeTask(
      { taskId: Number(id) },
      {
        onSuccess: async () => {
          // 모든 관련 캐시 무효화
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: getListRecentQueryKey(),
            }),
            // 모든 모음 상세 페이지 캐시 무효화
            queryClient.invalidateQueries({
              predicate: (query) =>
                Array.isArray(query.queryKey) &&
                query.queryKey[0] === 'collectionTasks',
            }),
            // 홈 화면 모음 목록 캐시 무효화
            queryClient.invalidateQueries({
              queryKey: getListTop8QueryKey(),
            }),
            // 아카이브 탭 모음 목록 캐시 무효화
            queryClient.invalidateQueries({
              queryKey: getListByCategoryQueryKey(),
            }),
          ]);

          setTodoOverrides({});
          // 튜토리얼 할 일도 모달 표시
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
    // 튜토리얼 모음이면 토스트만 표시
    const archive = archiveContent.find((a) => String(a.collectionId) === id);
    if (archive?.isTutorial) {
      tutorialToast.showToast('기본 제공 모음은 삭제할 수 없어요');
      return;
    }

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
                queryKey: getListTop8QueryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: getListByCategoryQueryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: getListRecentQueryKey(),
              });
              closeModal();
            },
          }
        );
      },
      onNegative: closeModal,
    });
  };

  const handleRequestEditArchive = (id: string) => {
    // 튜토리얼 모음이면 토스트만 표시
    const archive = archiveContent.find((a) => String(a.collectionId) === id);
    if (archive?.isTutorial) {
      tutorialToast.showToast('기본 제공 모음은 수정할 수 없어요');
      return;
    }
    navigate(`${ROUTES.archiveEdit}/${id}`);
  };

  const handleClickArchive = (id: string) => {
    navigate(`${ROUTES.archiveDetail}/${id}`);
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

  const handleClickSearch = () => {
    navigate(ROUTES.search);
  };

  const handleTaskClick = (id: string) => {
    navigate(`${ROUTES.taskDetail}/${id}`);
  };

  return (
    <div className='relative flex min-h-screen flex-col'>
      <Background.GradientBackground>
        <HomeAppBar onClickSearch={handleClickSearch} />

        {/* 메인 컨텐츠 - 헤더와 바탭탭바 높이만큼 패딩 */}
        <main className='relative grow pb-[86px] pt-14'>
          <div className='mx-auto flex flex-col px-5 pb-[60px]'>
            <GreetingSection
              memberName={memberName}
              mainGreeting={categoryGreeting.main}
              subGreeting={categoryGreeting.sub}
              categoryIcon={categoryIcon}
            />
            <TodoSection
              items={latestTodos}
              onToggle={handleToggleTodo}
              onTaskClick={handleTaskClick}
            />
            <ArchiveSection
              items={latestArchives}
              onRequestDelete={handleRequestDeleteArchive}
              onRequestEdit={handleRequestEditArchive}
              onClick={handleClickArchive}
            />
          </div>
        </main>
      </Background.GradientBackground>

      {/* 하단 고정 버튼 */}
      <FloatingButton
        aria-label='새 할 일 추가'
        className='fixed bottom-[104px] right-6 z-40'
        onClick={handleCreateTodo}
      />

      {/* 바탭탭바 */}
      <TabBar.BottomTabBar value='home' onChange={handleTabChange} />

      {/* 튜토리얼 토스트 */}
      {tutorialToast.isVisible && (
        <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
          <FeedBack.Toast
            message={tutorialToast.message}
            actionLabel='확인'
            onClose={tutorialToast.hideToast}
          />
        </div>
      )}

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
