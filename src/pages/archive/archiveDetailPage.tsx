import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { BackDetailBar } from '@/components/common/appBar';
import { EmptyNotice } from '@/components/common/feedBack';
import { FloatingButton } from '@/components/common/button/floatingButton';
import { TabBar, FeedBack, InfiniteScroll } from '@/components/common';
import { StickyTabSection } from '@/components/archive/stickyTabSection';
import {
  SwipeableDeleteCard,
  type Task,
} from '@/components/archive/swipeableDeleteCard';
import type { TabKey } from '@/components/common/tabBar/bottomTabBar';
import { ROUTES } from '@/constants/routes';
import { osShareTask } from '@/utils/nativeBridge';
import { OptionMenu } from '@/components/common/menu/optionMenu';
import {
  listByCollection,
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
  ListByCollectionParams,
  TaskResponse,
} from '@/api/generated/models';
import { useTutorialTaskStore } from '@/stores/useTutorialTaskStore';
import { useToast } from '@/hooks/useToast';

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
    isTutorial: true,
    createdAt: '오늘',
    modifiedAt: '오늘',
    domain: '노션 (Notion)',
  },
];

const BEFORE_LOGIN_ARCHIVE_META = {
  title: '두링크(DoLink) 튜토리얼',
  category: '기타',
  categoryIcon: etcIcon,
};
const PAGE_SIZE = 10;

interface PagedTaskResult {
  tasks: Task[];
  hasMore: boolean;
}

const mapTaskResponseToTask = (task: TaskResponse): Task => {
  return {
    taskId: task.taskId ?? 0,
    title: task.title ?? '',
    link: task.link ?? null,
    memo: task.memo ?? null,
    status: task.status ?? false,
    inout: task.inout ?? false,
    isTutorial: task.isTutorial ?? false,
    createdAt: task.createdAt ?? new Date().toISOString(),
    modifiedAt: task.createdAt ?? new Date().toISOString(),
    thumbnailUrl: task.thumbnailUrl ?? null,
    domain: task.domain ?? null,
  };
};

const getSortParam = (sortOption: SortOption): string =>
  sortOption === 'newest' ? 'desc' : 'asc';

// 서버에서는 completed 필터링을 사용하지 않고,
// 전체를 받아온 뒤 탭과 linkStates로 클라이언트에서 필터링
const fetchTasksFromServer = async (
  collectionId: number,
  page: number,
  sortOption: SortOption
): Promise<PagedTaskResult> => {
  const params: ListByCollectionParams = {
    page,
    size: PAGE_SIZE,
    sort: getSortParam(sortOption),
  };

  try {
    const response = (await listByCollection(
      collectionId,
      params
    )) as unknown as ApiResponseSliceTaskResponse;

    const result = response?.result;

    if (!result) {
      return { tasks: [], hasMore: false };
    }

    const content = result.content ?? [];
    const tasks = content.map(mapTaskResponseToTask);
    const last = result.last ?? true;

    return {
      tasks,
      hasMore: !last,
    };
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return { tasks: [], hasMore: false };
  }
};

const ArchiveDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isBeforeLoginArchive = location.pathname === ROUTES.archiveTutorial;

  const queryClient = useQueryClient();
  const collectionId = id ? Number(id) : 0;
  const { isTaskCompleted, toggleTask } = useTutorialTaskStore();

  // API 연결 시 사용: 페이지네이션 파라미터를 전달해야 함
  // const { data: taskData } = useListByCollection(
  //   collectionId,
  //   { page: currentPage, size: 10, sort: 'desc' },
  //   { query: { enabled: !isBeforeLoginArchive && !!collectionId } }
  // );

  const { data: collectionData } = useGetCollectDetail(collectionId, {
    query: { enabled: !isBeforeLoginArchive && !!collectionId },
  });

  const { mutate: completeTask } = useCompleteTask();
  const { mutateAsync: deleteTask } = useDeleteTask();
  const { mutate: deleteCollect } = useDeleteCollect();

  // API 데이터만 사용
  const apiCollectionData =
    collectionData as unknown as ApiResponseCollectionDetailResponse;
  const apiTitle = apiCollectionData?.result?.name;
  const apiCategory = apiCollectionData?.result?.category;
  const apiTaskCount = apiCollectionData?.result?.taskCount ?? 0;

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
  const tutorialToast = useToast();
  const loginToast = useToast();
  const [pendingDeleteTaskIds, setPendingDeleteTaskIds] = useState<number[]>(
    []
  );
  const [isCollectionDeleteOpen, setIsCollectionDeleteOpen] = useState(false);
  const titleSectionRef = useRef<HTMLDivElement>(null);
  // 튜토리얼 전용 상태
  const [tutorialTasks, setTutorialTasks] = useState<Task[]>([]);

  // 각 링크의 완료/미완료 상태 관리
  const [linkStates, setLinkStates] = useState<Record<number, boolean>>({});
  // 각 링크의 편집 모드 상태 관리
  const [linkEditModes, setLinkEditModes] = useState<Record<number, boolean>>(
    {}
  );
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  // React Query: 할 일 목록 (무한 스크롤)
  const {
    data: taskData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInitialLoading,
  } = useInfiniteQuery<PagedTaskResult>({
    queryKey: ['collectionTasks', collectionId, sortOption],
    queryFn: ({ pageParam = 0 }) =>
      fetchTasksFromServer(collectionId, pageParam as number, sortOption),
    enabled: !isBeforeLoginArchive && !!collectionId,
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: PagedTaskResult,
      allPages: PagedTaskResult[]
    ) => (lastPage.hasMore ? allPages.length : undefined),
  });

  // API 기반 task 리스트 평탄화 (useMemo로 안정화)
  const apiTaskList = useMemo(
    () => taskData?.pages.flatMap((page) => page.tasks) ?? [],
    [taskData]
  );

  // 실제 화면에서 사용할 task 리스트
  const taskList = isBeforeLoginArchive ? tutorialTasks : apiTaskList;

  // 튜토리얼 모음인지 확인 (첫 번째 할 일이 isTutorial이면 튜토리얼 모음)
  const isTutorialCollection = useMemo(() => {
    return (
      isBeforeLoginArchive || (taskList.length > 0 && taskList[0].isTutorial)
    );
  }, [isBeforeLoginArchive, taskList]);

  // 전체 todo 데이터 기준으로 개수 계산
  const { totalCount, incompleteCount, completeCount } = useMemo(() => {
    const allTasks = taskList;
    let incomplete = 0;
    let complete = 0;

    for (const task of allTasks) {
      const completed = linkStates[task.taskId] ?? task.status;
      if (completed) complete += 1;
      else incomplete += 1;
    }

    return {
      totalCount: allTasks.length,
      incompleteCount: incomplete,
      completeCount: complete,
    };
  }, [linkStates, taskList]);

  // 탭에 따라 보여줄 개수 선택
  // 전체 탭에서는 API의 taskCount 사용, 나머지는 로컬 계산값 사용
  const todoCount =
    selectedTab === 'all'
      ? isBeforeLoginArchive
        ? totalCount
        : apiTaskCount
      : selectedTab === 'incomplete'
        ? incompleteCount
        : completeCount;

  // 튜토리얼 초기화
  useEffect(() => {
    if (isBeforeLoginArchive) {
      setTutorialTasks(BEFORE_LOGIN_TASKS);
      setLinkStates(
        BEFORE_LOGIN_TASKS.reduce(
          (acc, task) => ({
            ...acc,
            [task.taskId]: isTaskCompleted(task.taskId.toString()),
          }),
          {}
        )
      );
      setLinkEditModes(
        BEFORE_LOGIN_TASKS.reduce(
          (acc, task) => ({ ...acc, [task.taskId]: false }),
          {}
        )
      );
    }
  }, [isBeforeLoginArchive, isTaskCompleted]);

  // API 데이터로 linkStates / linkEditModes 초기화
  useEffect(() => {
    if (!isBeforeLoginArchive && apiTaskList.length > 0) {
      setLinkStates((prev) => {
        let hasChanges = false;
        const next = { ...prev };

        apiTaskList.forEach((task) => {
          if (!(task.taskId in next)) {
            next[task.taskId] = task.status;
            hasChanges = true;
          }
        });

        return hasChanges ? next : prev;
      });

      setLinkEditModes((prev) => {
        let hasChanges = false;
        const next = { ...prev };

        apiTaskList.forEach((task) => {
          if (!(task.taskId in next)) {
            next[task.taskId] = false;
            hasChanges = true;
          }
        });

        return hasChanges ? next : prev;
      });
    }
  }, [apiTaskList, isBeforeLoginArchive]);

  const handleLinkCheck = (taskId: number, checked: boolean) => {
    setLinkStates((prev) => ({ ...prev, [taskId]: checked }));

    if (isBeforeLoginArchive) {
      // 미로그인: 전역 스토어에 저장
      toggleTask(taskId.toString());
      return;
    }

    // 튜토리얼 할 일이면 API 호출 X
    const task = taskList.find((t) => t.taskId === taskId);
    if (task?.isTutorial) {
      return;
    }

    completeTask(
      { taskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['collectionTasks', collectionId],
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

  const handleTaskClick = (taskId: number) => {
    if (isBeforeLoginArchive) {
      navigate(ROUTES.taskDetail + '/tutorial');
    } else {
      navigate(`${ROUTES.taskDetail}/${taskId}`);
    }
  };

  // 그룹 단위 삭제 핸들러 (같은 날짜의 모든 할 일을 삭제)
  const handleDeleteGroup = (taskIds: number[]) => {
    // 모달 표시를 위해 pendingDeleteTaskIds에 저장
    setPendingDeleteTaskIds(taskIds);
  };

  const handleOption = () => {
    setIsOptionMenuOpen((prev) => !prev);
  };

  const handleOptionSelect = (key: string) => {
    setIsOptionMenuOpen(false);
    if (key === 'edit') {
      if (isTutorialCollection) {
        // 튜토리얼 모음: 토스트 표시
        if (isBeforeLoginArchive) {
          // 미로그인: 로그인 토스트
          loginToast.showToast('로그인 후 간편하게 DoLink를 이용해보세요');
        } else {
          // 로그인: 튜토리얼 토스트
          tutorialToast.showToast('기본 제공 모음은 수정할 수 없어요');
        }
        return;
      }
      navigate(`${ROUTES.archiveEdit}/${collectionId}`);
    } else if (key === 'delete') {
      if (isTutorialCollection) {
        // 튜토리얼 모음: 토스트 표시
        if (isBeforeLoginArchive) {
          // 미로그인: 로그인 토스트
          loginToast.showToast('로그인 후 간편하게 DoLink를 이용해보세요');
        } else {
          // 로그인: 튜토리얼 토스트
          tutorialToast.showToast('기본 제공 모음은 삭제할 수 없어요');
        }
        return;
      }
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
    if (pendingDeleteTaskIds.length === 0 || isDeletingTask) return;

    setIsDeletingTask(true);

    // ✅ 복사본 생성 (스코프 명확화)
    const taskIdsToDelete = [...pendingDeleteTaskIds];

    // 튜토리얼 모음은 로컬 상태만 업데이트
    if (isBeforeLoginArchive) {
      setTutorialTasks((prev) =>
        prev.filter((task) => !taskIdsToDelete.includes(task.taskId))
      );

      setLinkStates((prev) => {
        const next = { ...prev };
        taskIdsToDelete.forEach((taskId) => {
          delete next[taskId];
        });
        return next;
      });

      setLinkEditModes((prev) => {
        const next = { ...prev };
        taskIdsToDelete.forEach((taskId) => {
          delete next[taskId];
        });
        return next;
      });

      setPendingDeleteTaskIds([]);
      setIsDeletingTask(false);
      return;
    }

    // API 모음: 낙관적 업데이트 (linkStates / linkEditModes 기준)
    const previousLinkStates = { ...linkStates };
    const previousLinkEditModes = { ...linkEditModes };

    // 즉시 UI에서 제거
    setLinkStates((prev) => {
      const next = { ...prev };
      taskIdsToDelete.forEach((taskId) => {
        delete next[taskId];
      });
      return next;
    });

    setLinkEditModes((prev) => {
      const next = { ...prev };
      taskIdsToDelete.forEach((taskId) => {
        delete next[taskId];
      });
      return next;
    });

    // 모달 닫기
    setPendingDeleteTaskIds([]);

    // 복사본 사용
    Promise.all(taskIdsToDelete.map((taskId) => deleteTask({ taskId })))
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ['collectionTasks', collectionId],
        });
        setIsDeletingTask(false);
      })
      .catch((error) => {
        console.error('할 일 삭제 실패:', error);
        setLinkStates(previousLinkStates);
        setLinkEditModes(previousLinkEditModes);
        setIsDeletingTask(false);
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
      });
  };

  const handleFloatingButtonClick = () => {
    if (isBeforeLoginArchive) {
      loginToast.showToast('로그인 후 간편하게 DoLink를 이용해보세요');
      return;
    }
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

  // createdAt별로 링크를 필터링, 그룹화 (정렬은 서버에서 처리됨)
  const groupedLinks = useMemo(() => {
    // 1. 필터링 - linkStates를 기준으로 필터링하여 실시간 체크 상태 반영
    let filtered: Task[];
    switch (selectedTab) {
      case 'all':
        filtered = taskList;
        break;
      case 'incomplete':
        filtered = taskList.filter(
          (task) => !(linkStates[task.taskId] ?? task.status)
        );
        break;
      case 'complete':
        filtered = taskList.filter(
          (task) => linkStates[task.taskId] ?? task.status
        );
        break;
      default:
        filtered = taskList;
    }

    const grouped = new Map<string, Task[]>();

    filtered.forEach((link) => {
      // 삭제된 항목: linkStates에 없으면 스킵 (API 모음용)
      if (!isBeforeLoginArchive && !(link.taskId in linkStates)) {
        return;
      }

      // createdAt을 로컬 날짜로 변환하여 날짜만 추출 (yyyy-MM-dd)
      const date = new Date(link.createdAt);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;

      // 디버깅: 날짜 그룹화 확인
      console.log(
        `Task ${link.taskId}: createdAt=${link.createdAt}, key=${key}`
      );

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(link);
    });

    // 그룹화된 데이터는 이미 정렬된 순서로 오므로 날짜별로만 변환
    const result = Array.from(grouped.entries());

    return result;
  }, [taskList, selectedTab, linkStates, isBeforeLoginArchive]);

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
      <div ref={titleSectionRef} className='bg-white pb-4 pt-20'>
        {/* 제목 */}
        <div className='px-5'>
          <h1 className='truncate text-heading-lg text-grey-900'>
            {archiveMeta.title}
          </h1>
        </div>

        {/* 카테고리 및 할일 정보 */}
        <div className='mt-1 flex items-center gap-2 px-5'>
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
      <main className='flex-1 px-5 pb-[86px] pt-6'>
        {isInitialLoading ? (
          <div className='flex min-h-[400px] items-center justify-center'>
            <p className='text-body-md text-grey-500'>불러오는 중...</p>
          </div>
        ) : !hasData ? (
          <div className='flex min-h-[400px] items-center justify-center'>
            <EmptyNotice
              title='저장할 링크를 추가해주세요'
              subtitle='우측 하단 검정색 + 버튼으로 추가할 수 있어요'
            />
          </div>
        ) : (
          <InfiniteScroll.InfiniteScroll<[string, Task[]]>
            items={groupedLinks}
            keyExtractor={([dateKey]: [string, Task[]]) => dateKey}
            renderItem={([_dateKey, tasks]: [string, Task[]]) => (
              <SwipeableDeleteCard
                tasks={tasks}
                createdAt={
                  tasks[0].createdAt === '오늘'
                    ? new Date()
                    : new Date(tasks[0].createdAt)
                }
                linkStates={linkStates}
                linkEditModes={linkEditModes}
                onCheck={handleLinkCheck}
                onTaskClick={handleTaskClick}
                onDeleteGroup={handleDeleteGroup}
                onEditModeChange={(isEditMode) => {
                  tasks.forEach((task) => {
                    handleEditModeChange(task.taskId, isEditMode);
                  });
                }}
                onOriginalClick={(taskId) => {
                  const task = tasks.find((t) => t.taskId === taskId);
                  if (task && task.link && task.inout) {
                    console.log('원본 클릭:', task.title);
                    window.open(task.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                onShareClick={(taskId) => {
                  osShareTask(taskId);
                }}
                onEditClick={() => {
                  // 할 일 편집 버튼(연필 아이콘) 클릭 시
                  if (isBeforeLoginArchive) {
                    // 미로그인: 로그인 토스트
                    loginToast.showToast(
                      '로그인 후 간편하게 DoLink를 이용해보세요'
                    );
                  } else if (isTutorialCollection) {
                    // 로그인 + 튜토리얼: 튜토리얼 토스트
                    tutorialToast.showToast(
                      '기본 제공 할 일은 수정할 수 없어요'
                    );
                  } else {
                    navigate(`${ROUTES.archiveEdit}/${collectionId}`);
                  }
                }}
                onDeleteClick={(taskId) => {
                  if (isBeforeLoginArchive) {
                    // 미로그인: 로그인 토스트
                    loginToast.showToast(
                      '로그인 후 간편하게 DoLink를 이용해보세요'
                    );
                  } else if (isTutorialCollection) {
                    // 로그인 + 튜토리얼: 튜토리얼 토스트
                    tutorialToast.showToast(
                      '기본 제공 할 일은 삭제할 수 없어요'
                    );
                  } else {
                    setPendingDeleteTaskIds([taskId]);
                  }
                }}
                capsuleDisabled={false}
              />
            )}
            onLoadMore={() => {
              if (!isBeforeLoginArchive && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            hasNextPage={isBeforeLoginArchive ? false : hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            loadingMessage='할 일을 더 불러오는 중입니다'
            emptyMessage='할 일이 없습니다'
            className='space-y-3'
          />
        )}
      </main>

      {/* TODO  플로팅 전역으로 수정*/}
      {/* 플로팅 버튼 */}
      <FloatingButton
        onClick={handleFloatingButtonClick}
        className='fixed bottom-[104px] right-6 z-40'
      />

      {/* 하단 탭바 */}
      {/* TODO  탭바 Approuter로 분리 */}
      <footer className='sticky bottom-0 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
        <TabBar.BottomTabBar value='archive' onChange={handleTabChange} />
      </footer>

      {/* 할 일 삭제 확인 모달 */}
      <FeedBack.ModalLayout
        open={pendingDeleteTaskIds.length > 0}
        onClose={() => setPendingDeleteTaskIds([])}
      >
        <FeedBack.ConfirmDialog
          title='할 일을 삭제할까요?'
          positiveLabel='삭제하기'
          negativeLabel='취소'
          onPositive={handleConfirmTaskDelete}
          onNegative={() => setPendingDeleteTaskIds([])}
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

      {/* 튜토리얼 모음용 토스트 */}
      {tutorialToast.isVisible && (
        <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
          <FeedBack.Toast message={tutorialToast.message} actionLabel='확인' />
        </div>
      )}

      {/* 로그인 토스트 */}
      {loginToast.isVisible && (
        <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
          <FeedBack.Toast
            message={loginToast.message}
            actionLabel='로그인'
            onAction={() => navigate(ROUTES.login)}
          />
        </div>
      )}
    </div>
  );
};

export default ArchiveDetailPage;
