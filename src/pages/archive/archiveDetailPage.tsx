import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { BackDetailBar } from '@/components/common/appBar';
import { EmptyNotice } from '@/components/common/feedBack';
import { FloatingButton } from '@/components/common/button/floatingButton';
import { TabBar, FeedBack } from '@/components/common';
import { StickyTabSection } from '@/components/archive/stickyTabSection';
import {
  SwipeableDeleteCard,
  type Task,
} from '@/components/archive/swipeableDeleteCard';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { ROUTES } from '@/constants/routes';
import { OptionMenu } from '@/components/common/menu/optionMenu';
import {
  useListByCollection,
  getListByCollectionQueryKey,
  useCompleteTask,
  useDeleteTask,
} from '@/api/generated/endpoints/task/task';
import {
  useDeleteCollect,
  useGetCollectDetail,
  getListAll1QueryKey as getListAllQueryKey,
  getListByCategoryQueryKey,
  getGetCollectDetailQueryKey,
} from '@/api/generated/endpoints/collection/collection';
import type {
  ApiResponseSliceTaskResponse,
  ApiResponseCollectionDetailResponse,
} from '@/api/generated/models';

// 카테고리 아이콘 임포트
import restaurantIcon from '@/assets/icons/category/detail/restaurant.svg';
import hobbyIcon from '@/assets/icons/category/detail/hobby.svg';
import travelIcon from '@/assets/icons/category/detail/travel.svg';
import moneyIcon from '@/assets/icons/category/detail/money.svg';
import shoppingIcon from '@/assets/icons/category/detail/shopping.svg';
import exerciseIcon from '@/assets/icons/category/detail/exercise.svg';
import careerIcon from '@/assets/icons/category/detail/career.svg';
import studyIcon from '@/assets/icons/category/detail/study.svg';
import tipsIcon from '@/assets/icons/category/detail/tips.svg';
import etcIcon from '@/assets/icons/category/detail/etc.svg';
import todoIcon from '@/assets/icons/category/detail/todo.svg';

const CATEGORY_ICON_MAP: Record<string, string> = {
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

type TabType = 'all' | 'incomplete' | 'complete';
type SortOption = 'newest' | 'oldest';

const TAB_ROUTE_MAP: Record<TabKey, string> = {
  home: ROUTES.home,
  archive: ROUTES.archives,
  setting: ROUTES.settings,
};

const SORT_OPTIONS = [
  { value: 'newest', label: '최신 순' },
  { value: 'oldest', label: '오래된 순' },
];

const TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'incomplete', label: '미완료' },
  { value: 'complete', label: '완료' },
];

const BEFORE_LOGIN_TASKS: Task[] = [
  {
    taskId: 1,
    title: '두링크(DoLink) 안내서 📚',
    link: '노션 (Notion)',
    memo: '',
    status: false,
    inout: false,
    createdAt: '오늘',
    modifiedAt: '오늘',
  },
];

const BEFORE_LOGIN_ARCHIVE_META = {
  title: '두링크(DoLink) 튜토리얼',
  category: '기타',
  categoryIcon: etcIcon,
};

const ArchiveDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isBeforeLoginArchive = location.pathname === ROUTES.archiveTutorial;

  const queryClient = useQueryClient();
  const collectionId = id ? Number(id) : 0;

  const { data: taskData } = useListByCollection(collectionId, undefined, {
    query: { enabled: !isBeforeLoginArchive && !!collectionId },
  });

  const { data: collectionData } = useGetCollectDetail(collectionId, {
    query: { enabled: !isBeforeLoginArchive && !!collectionId },
  });

  const { mutate: completeTask } = useCompleteTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: deleteCollect } = useDeleteCollect();

  // API 데이터만 사용
  const apiCollectionData =
    collectionData as unknown as ApiResponseCollectionDetailResponse;
  const apiTitle = apiCollectionData?.result?.name;
  const apiCategory = apiCollectionData?.result?.category;

  const archiveMeta = isBeforeLoginArchive
    ? BEFORE_LOGIN_ARCHIVE_META
    : {
        title: apiTitle ?? '모음',
        category: apiCategory ?? '',
        categoryIcon: CATEGORY_ICON_MAP[apiCategory ?? ''] ?? etcIcon,
      };

  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<number | null>(
    null
  );
  const [isCollectionDeleteOpen, setIsCollectionDeleteOpen] = useState(false);
  const titleSectionRef = useRef<HTMLDivElement>(null);

  // 나중에 API로 데이터 받을 예정이면
  const [taskList, setTaskList] = useState<Task[]>([]);

  // 각 링크의 완료/미완료 상태 관리
  const [linkStates, setLinkStates] = useState<Record<number, boolean>>({});
  // 각 링크의 편집 모드 상태 관리
  const [linkEditModes, setLinkEditModes] = useState<Record<number, boolean>>(
    {}
  );

  const todoCount = useMemo(() => {
    return taskList.reduce((count, task) => {
      const completed = linkStates[task.taskId] ?? task.status;
      return completed ? count : count + 1;
    }, 0);
  }, [linkStates, taskList]);

  useEffect(() => {
    let sourceTasks: Task[];

    if (isBeforeLoginArchive) {
      sourceTasks = BEFORE_LOGIN_TASKS;
    } else {
      const apiResponse = taskData as unknown as ApiResponseSliceTaskResponse;
      const apiTasks = apiResponse?.result?.content ?? [];

      sourceTasks = apiTasks.map((t) => ({
        taskId: t.taskId ?? 0,
        title: t.title ?? '',
        link: t.link ?? null,
        memo: t.memo ?? null,
        status: t.status ?? false,
        inout: t.inout ?? false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      }));
    }

    setTaskList(sourceTasks);
    setLinkStates(
      sourceTasks.reduce(
        (acc, task) => ({ ...acc, [task.taskId]: task.status }),
        {}
      )
    );
    setLinkEditModes(
      sourceTasks.reduce((acc, task) => ({ ...acc, [task.taskId]: false }), {})
    );
  }, [isBeforeLoginArchive, taskData]);

  const handleLinkCheck = (taskId: number, checked: boolean) => {
    setLinkStates((prev) => ({ ...prev, [taskId]: checked }));
    completeTask(
      { taskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListByCollectionQueryKey(collectionId),
          });
        },
        onError: () => {
          setLinkStates((prev) => ({ ...prev, [taskId]: !checked }));
        },
      }
    );
  };

  const handleEditModeChange = (id: number, isEditMode: boolean) => {
    setLinkEditModes((prev) => ({ ...prev, [id]: isEditMode }));
  };

  const handleTabChange = (next: TabKey) => {
    navigate(TAB_ROUTE_MAP[next]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleClickSearch = () => {
    navigate(ROUTES.search);
  };

  const handleOption = () => {
    setIsOptionMenuOpen((prev) => !prev);
  };

  const handleOptionSelect = (key: string) => {
    setIsOptionMenuOpen(false);
    if (key === 'edit') {
      navigate(`${ROUTES.archiveEdit}/${collectionId}`);
    } else if (key === 'delete') {
      setIsCollectionDeleteOpen(true);
    }
  };

  const handleConfirmCollectionDelete = () => {
    deleteCollect(
      { collectId: collectionId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAllQueryKey() });
          queryClient.invalidateQueries({
            queryKey: getListByCategoryQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetCollectDetailQueryKey(collectionId),
          });
          setIsCollectionDeleteOpen(false);
          navigate(ROUTES.archives, { replace: true });
        },
      }
    );
  };

  const handleConfirmTaskDelete = () => {
    if (pendingDeleteTaskId === null) return;
    deleteTask(
      { taskId: pendingDeleteTaskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListByCollectionQueryKey(collectionId),
          });
          setPendingDeleteTaskId(null);
        },
      }
    );
  };

  const handleFloatingButtonClick = () => {
    navigate(ROUTES.taskCreate);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
  };

  const handleContentTabChange = (tab: string) => {
    setSelectedTab(tab as TabType);
  };

  const handleSortChangeString = (value: string) => {
    handleSortChange(value as SortOption);
  };

  // 큰 제목 섹션의 표시 여부를 감지
  useEffect(() => {
    const titleElement = titleSectionRef.current;

    if (!titleElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsTitleVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      }
    );

    observer.observe(titleElement);

    return () => {
      if (titleElement) {
        observer.unobserve(titleElement);
      }
    };
  }, []);

  // createdAt별로 링크를 필터링, 정렬, 그룹화
  const groupedLinks = useMemo(() => {
    // 1. 필터링 - linkStates를 기준으로 필터링하여 실시간 체크 상태 반영
    let filtered: Task[];
    switch (selectedTab) {
      case 'all':
        filtered = taskList;
        break;
      case 'incomplete':
        filtered = taskList.filter((task) => !linkStates[task.taskId]);
        break;
      case 'complete':
        filtered = taskList.filter((task) => linkStates[task.taskId]);
        break;
      default:
        filtered = taskList;
    }

    const grouped = new Map<string, Task[]>();

    filtered.forEach((link) => {
      const key = link.createdAt.split('T')[0];
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(link);
    });

    const toTimestamp = (key: string) => {
      if (key === '오늘') {
        return new Date().getTime();
      }
      return new Date(key).getTime();
    };

    const result = Array.from(grouped.entries()).sort(([aKey], [bKey]) => {
      const aDate = toTimestamp(aKey);
      const bDate = toTimestamp(bKey);
      return sortOption === 'newest' ? bDate - aDate : aDate - bDate;
    });

    return result;
  }, [taskList, selectedTab, sortOption, linkStates]);

  const hasData = groupedLinks.length > 0;

  return (
    <div className='relative flex min-h-screen flex-col bg-grey-50'>
      {/* 상단 앱바 - 고정 */}
      {/* TODO  BackDetailBar 고정 수정*/}
      <div className='sticky left-0 right-0 top-0 z-10 w-full'>
        <BackDetailBar
          title={isTitleVisible ? '모음 상세' : archiveMeta.title}
          rightIcons={['search', 'option']}
          onClickBack={handleBack}
          onClickSearch={handleClickSearch}
          onClickOption={handleOption}
        />
      </div>

      {/* 옵션 메뉴 */}
      {isOptionMenuOpen && (
        <>
          <div
            className='fixed inset-0 z-modal-overlay'
            onClick={() => setIsOptionMenuOpen(false)}
          />
          <div className='fixed right-5 top-14 z-modal-content'>
            <OptionMenu onSelect={handleOptionSelect} />
          </div>
        </>
      )}

      {/* 제목 및 정보 영역 */}
      <div ref={titleSectionRef} className='bg-white pb-4 pt-6'>
        {/* 제목 */}
        <div className='px-5'>
          <h1 className='truncate text-heading-lg text-grey-900'>
            {archiveMeta.title}
          </h1>
        </div>

        {/* 카테고리 및 할일 정보 */}
        <div className='flex items-center gap-2 px-5'>
          <div className='flex items-center gap-1'>
            <img
              src={archiveMeta.categoryIcon}
              alt=''
              className='size-4 shrink-0'
            />
            <span className='text-body-lg text-grey-700'>
              {archiveMeta.category}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <img src={todoIcon} alt='' className='size-4 shrink-0' />
            <span className='text-body-lg text-grey-700'>{todoCount}개</span>
          </div>
        </div>
      </div>

      {/* 탭 및 정렬 */}
      <StickyTabSection
        tabs={TAB_OPTIONS}
        selectedTab={selectedTab}
        onTabChange={handleContentTabChange}
        sortOptions={SORT_OPTIONS}
        sortValue={sortOption}
        onSortChange={handleSortChangeString}
      />

      {/* 메인 콘텐츠 */}
      <main className='grow px-5 py-8'>
        {!hasData ? (
          <div className='flex min-h-[400px] items-center justify-center'>
            <EmptyNotice
              title='저장할 링크를 추가해주세요'
              subtitle='우측 하단 검정색 + 버튼으로 추가할 수 있어요'
            />
          </div>
        ) : (
          <div className='space-y-3'>
            {groupedLinks.map(([dateKey, tasks], index) => (
              <SwipeableDeleteCard
                key={`${dateKey}-${index}`}
                tasks={tasks}
                createdAt={
                  tasks[0].createdAt === '오늘'
                    ? new Date()
                    : new Date(tasks[0].createdAt)
                }
                linkStates={linkStates}
                linkEditModes={linkEditModes}
                onCheck={handleLinkCheck}
                onEditModeChange={(isEditMode) => {
                  tasks.forEach((task) => {
                    handleEditModeChange(task.taskId, isEditMode);
                  });
                }}
                onOriginalClick={(taskId) => {
                  const task = tasks.find((t) => t.taskId === taskId);
                  if (task && task.link) {
                    console.log('원본 클릭:', task.title);
                    window.open(task.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                onShareClick={(taskId) => {
                  const task = tasks.find((t) => t.taskId === taskId);
                  if (task) {
                    console.log('공유 클릭:', task.title);
                    alert(`${task.title} 공유하기`);
                  }
                }}
                onEditClick={(taskId) => {
                  const task = tasks.find((t) => t.taskId === taskId);
                  if (task) {
                    console.log('편집 클릭:', task.title);
                    alert(`${task.title} 편집하기`);
                  }
                }}
                onDeleteClick={(taskId) => {
                  setPendingDeleteTaskId(taskId);
                }}
                capsuleDisabled={isBeforeLoginArchive}
              />
            ))}
          </div>
        )}
      </main>

      {/* TODO  플로팅 전역으로 수정*/}
      {/* 플로팅 버튼 */}
      <FloatingButton
        onClick={handleFloatingButtonClick}
        className='fixed bottom-[120px] right-5'
      />

      {/* 하단 탭바 */}
      {/* TODO  탭바 Approuter로 분리 */}
      <footer className='sticky bottom-0 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
        <TabBar.BottomTabBar value='archive' onChange={handleTabChange} />
      </footer>

      {/* 할 일 삭제 확인 모달 */}
      <FeedBack.ModalLayout
        open={pendingDeleteTaskId !== null}
        onClose={() => setPendingDeleteTaskId(null)}
      >
        <FeedBack.ConfirmDialog
          title='할 일을 삭제할까요?'
          positiveLabel='삭제하기'
          negativeLabel='취소'
          onPositive={handleConfirmTaskDelete}
          onNegative={() => setPendingDeleteTaskId(null)}
        />
      </FeedBack.ModalLayout>

      {/* 모음 삭제 확인 모달 */}
      <FeedBack.ModalLayout
        open={isCollectionDeleteOpen}
        onClose={() => setIsCollectionDeleteOpen(false)}
      >
        <FeedBack.ConfirmDialog
          title='모음을 삭제할까요?'
          subtitle='모음 내 할 일도 함께 삭제돼요.'
          positiveLabel='삭제하기'
          negativeLabel='취소'
          onPositive={handleConfirmCollectionDelete}
          onNegative={() => setIsCollectionDeleteOpen(false)}
        />
      </FeedBack.ModalLayout>
    </div>
  );
};

export default ArchiveDetailPage;
