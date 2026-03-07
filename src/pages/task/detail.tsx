import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { BackDetailBar } from '@/components/common/appBar/backDetailAppBar';
import { GreyLine } from '@/components/common/line/greyLine';
import { CtaButton } from '@/components/common/button/ctaButton';
import { CheckIcon } from '@/components/common/icons/checkIcon';
import { OptionMenu } from '@/components/common/menu/optionMenu';
import EmptyNotice from '@/components/common/feedBack/emptyNotice';
import { FeedBack } from '@/components/common';
import Toast from '@/components/common/feedBack/toast';
import ModalLayout from '@/components/common/feedBack/modalLayout';
import { openLink, isReactNativeWebView } from '@/utils/nativeBridge';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTutorialTaskStore } from '@/stores/useTutorialTaskStore';
import { useToast } from '@/hooks/useToast';
import {
  useGetTask,
  useCompleteTask,
  useDeleteTask,
  getGetTaskQueryKey,
  getListRecentQueryKey,
} from '@/api/generated/endpoints/task/task';
import { formatRelativeDateLabel } from '@/utils/date';
import { useGetCollectDetail } from '@/api/generated/endpoints/collection/collection';
import type {
  ApiResponseTaskResponse,
  ApiResponseCollectionDetailResponse,
} from '@/api/generated/models';

// 아이콘
import imgNoData from '@/assets/icons/common/no-img-data.svg';
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
import calendarIcon from '@/assets/icons/category/detail/calendar.svg';
import memoIcon from '@/assets/icons/category/detail/memo.svg';

const CATEGORY_ICON_MAP: Record<string, string> = {
  맛집: restaurantIcon,
  취미: hobbyIcon,
  여행: travelIcon,
  재테크: moneyIcon,
  쇼핑: shoppingIcon,
  운동: exerciseIcon,
  커리어: careerIcon,
  공부: studyIcon,
  꿀팁: tipsIcon,
  기타: etcIcon,
};

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();
  const taskId = Number(id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isTaskCompleted, toggleTask } = useTutorialTaskStore();

  // 미로그인 사용자를 위한 특별 경로인지 확인 (mock 데이터 사용)
  const isTutorialPath = location.pathname.includes('/tutorial');
  const shouldUseMockData = !isAuthenticated && isTutorialPath;

  // API 호출 (로그인 상태일 때는 항상 호출)
  const { data: taskResponse, isLoading: isLoadingTask } = useGetTask(taskId, {
    query: { enabled: isAuthenticated },
  });
  const apiTaskResponse = taskResponse as unknown as ApiResponseTaskResponse;
  const taskData = shouldUseMockData ? null : apiTaskResponse?.result;
  const collectionId = taskData?.collectionId;

  const { data: collectionResponse, isLoading: isLoadingCollection } =
    useGetCollectDetail(collectionId ?? 0, {
      query: { enabled: !!collectionId && isAuthenticated },
    });
  const apiCollectionResponse =
    collectionResponse as unknown as ApiResponseCollectionDetailResponse;
  const collectionData = shouldUseMockData
    ? null
    : apiCollectionResponse?.result;

  const { mutate: completeTask } = useCompleteTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [imageError, setImageError] = useState(false);
  const [appBarHeight, setAppBarHeight] = useState(56);
  const [bottomHeight, setBottomHeight] = useState(104);
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const tutorialToast = useToast();
  const loginToast = useToast();
  const appBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  // 미로그인 사용자를 위한 튜토리얼 목 데이터
  const tutorialMockData = {
    taskId: 1,
    title: '두링크(DoLink) 안내서📚',
    link: 'https://www.notion.so/DoLink-30347f96a7fc8039ae52e566e4c26087',
    memo: '',
    thumbnailUrl: undefined,
    status: false,
    createdAt: new Date().toISOString(),
    collectionName: '두링크(DoLink) 튜토리얼',
    category: '기타',
    inout: true,
    isTutorial: true,
  };

  // 표시할 데이터 결정
  const displayData = shouldUseMockData
    ? { ...tutorialMockData, status: isTaskCompleted('1') }
    : taskData;
  const displayCollection = shouldUseMockData
    ? {
        name: tutorialMockData.collectionName,
        category: tutorialMockData.category,
      }
    : collectionData;

  const isCompleted = displayData?.status ?? false;
  const categoryLabel = displayCollection?.category ?? '';
  const categoryIcon = CATEGORY_ICON_MAP[categoryLabel] ?? etcIcon;

  // 현재 inout :false - 내부, inout : true - 외부 판단
  // TODO : 백엔드 문의 후 수정 필요
  const isInout = shouldUseMockData ? true : (taskData?.inout ?? false);
  // 튜토리얼 여부: mock 데이터이거나 API 응답의 isTutorial이 true인 경우
  const isTutorial = shouldUseMockData || (taskData?.isTutorial ?? false);

  // 앱바 및 하단 버튼 영역 높이 동적 계산
  useEffect(() => {
    if (appBarRef.current) {
      const height = appBarRef.current.offsetHeight;
      setAppBarHeight(height);
    }
    if (bottomBarRef.current) {
      const height = bottomBarRef.current.offsetHeight;
      setBottomHeight(height);
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOption = () => {
    setIsOptionMenuOpen((prev) => !prev);
  };

  const handleOptionSelect = (key: string) => {
    if (key === 'edit') {
      if (isTutorial) {
        // 튜토리얼 할 일: 로그인 상태에 따라 다른 토스트 표시
        if (shouldUseMockData) {
          // 미로그인: 로그인 안내 토스트
          loginToast.showToast('로그인 후 간편하게 DoLink를 이용해보세요');
        } else {
          // 로그인: 튜토리얼 토스트
          tutorialToast.showToast('기본 제공 할 일은 수정할 수 없어요');
        }
        setIsOptionMenuOpen(false);
        return;
      }
      navigate(`${ROUTES.taskEdit}/${taskId}`);
    } else if (key === 'delete') {
      if (isTutorial) {
        // 튜토리얼 할 일: 로그인 상태에 따라 다른 토스트 표시
        if (shouldUseMockData) {
          // 미로그인: 로그인 안내 토스트
          loginToast.showToast('로그인 후 간편하게 DoLink를 이용해보세요');
        } else {
          // 로그인: 튜토리얼 토스트
          tutorialToast.showToast('기본 제공 할 일은 삭제할 수 없어요');
        }
        setIsOptionMenuOpen(false);
        return;
      }
      setIsDeleteModalOpen(true);
    }
    setIsOptionMenuOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteTask(
      { taskId },
      {
        onSuccess: () => {
          // 모음 관련 태스크 목록 캐시 무효화
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) &&
              query.queryKey[0] === 'collectionTasks',
          });

          // 최근 태스크 목록 캐시 무효화
          queryClient.invalidateQueries({
            predicate: (
              query // ← 이 부분 변경
            ) =>
              Array.isArray(query.queryKey) &&
              query.queryKey[0] === 'listRecent',
          });

          setIsDeleteModalOpen(false);
          navigate(-1);
        },
      }
    );
  };

  const handleLinkClick = () => {
    // inout이 true면 내부 추가 링크이므로 이동 불가
    if (isInout) {
      return;
    }

    const linkUrl = displayData?.link;
    if (linkUrl) {
      // React Native 환경에서는 네이티브 브릿지 사용
      if (isReactNativeWebView()) {
        openLink(linkUrl);
      } else {
        // 웹 브라우저 환경에서는 새 탭으로 열기
        window.open(linkUrl, '_blank');
      }
    }
  };

  const handleComplete = () => {
    // 미로그인 상태: 전역 스토어에 저장
    if (shouldUseMockData) {
      toggleTask('1');
      return;
    }
    // 로그인 상태: 튜토리얼 할 일도 완료 가능
    completeTask(
      { taskId },
      {
        onSuccess: async () => {
          // 모든 관련 캐시 무효화
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: getGetTaskQueryKey(taskId),
            }),
            queryClient.invalidateQueries({
              predicate: (query) =>
                Array.isArray(query.queryKey) &&
                query.queryKey[0] === 'collectionTasks',
            }),
            queryClient.invalidateQueries({
              queryKey: getListRecentQueryKey(),
            }),
          ]);

          // ✅ 추가: 즉시 재요청 (afterLogin.tsx의 handleToggleTodo와 동일)
          await Promise.all([
            queryClient.refetchQueries({
              predicate: (query) =>
                Array.isArray(query.queryKey) &&
                query.queryKey[0] === 'collectionTasks',
            }),
            queryClient.refetchQueries({
              queryKey: getListRecentQueryKey(),
            }),
          ]);
        },
      }
    );
  };

  // 로그인 사용자일 때만 로딩/에러 체크
  if (isAuthenticated && (isLoadingTask || isLoadingCollection)) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-body-lg text-grey-600'>로딩 중...</p>
      </div>
    );
  }

  if (isAuthenticated && !taskData) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <EmptyNotice
          title='할 일을 찾을 수 없습니다'
          subtitle='삭제되었거나 존재하지 않는 할 일입니다'
        />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      {/* 상단 앱바 */}
      {/* TODO  app bar 고정으로 통일 작업 시 제거 예정 */}
      <div className='fixed left-0 right-0 top-0 z-header' ref={appBarRef}>
        <BackDetailBar
          title='할 일 상세'
          rightIcons='option'
          onClickBack={handleBack}
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

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <ModalLayout
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <FeedBack.ConfirmDialog
            title='정말 삭제하시겠어요?'
            subtitle='삭제된 할 일은 복구할 수 없어요'
            positiveLabel='삭제하기'
            negativeLabel='취소'
            onPositive={handleConfirmDelete}
            onNegative={() => setIsDeleteModalOpen(false)}
          />
        </ModalLayout>
      )}

      {/* 메인 콘텐츠 */}
      <main
        className='relative flex flex-1 flex-col'
        style={{
          paddingTop: `${appBarHeight}px`,
          paddingBottom: `${bottomHeight}px`,
        }}
      >
        {/* 썸네일 이미지 - link에서 추출한 썸네일 표시, 없으면 기본 이미지 */}
        <div
          className='sticky z-0 h-40 w-full shrink-0 overflow-hidden bg-grey-200'
          style={{ top: `${appBarHeight}px` }}
        >
          {!shouldUseMockData && displayData?.thumbnailUrl && !imageError ? (
            <img
              src={displayData.thumbnailUrl}
              alt='task thumbnail'
              className='h-full w-full object-cover'
              onError={() => {
                setImageError(true);
              }}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <img src={imgNoData} alt='no image' className='h-auto w-auto' />
            </div>
          )}
        </div>

        {/* 할 일 정보 섹션 */}
        <div
          className='relative z-10 -mt-4 flex flex-col gap-3 bg-white px-5 py-6'
          style={{
            // 계산식: 화면 전체 높이 - 앱바 높이  - 하단 버튼 높이
            minHeight: `calc(100vh - ${appBarHeight}px  - ${bottomHeight}px)`,
          }}
        >
          {/* 제목 */}
          <h1 className='text-heading-xl text-black'>{displayData?.title}</h1>

          {/* 모음 제목 */}
          <p className='text-body-xl text-black'>
            {displayCollection?.name ?? '모음 없음'}
          </p>

          <GreyLine width='w-full' />

          {/* 카테고리 */}
          <div className='flex items-center gap-2'>
            <img src={categoryIcon} alt='' className='h-4 w-4 shrink-0' />
            <span className='text-body-md text-grey-700'>
              {categoryLabel || '카테고리 없음'}
            </span>
          </div>

          {/* 추가 날짜 */}
          <div className='flex items-center gap-2'>
            <img src={calendarIcon} alt='' className='h-4 w-4 shrink-0' />
            <span className='text-body-md text-grey-700'>
              {displayData?.createdAt
                ? formatRelativeDateLabel(displayData.createdAt)
                : '날짜 없음'}
            </span>
          </div>

          {/* 메모 */}
          {displayData?.memo && (
            <div className='flex items-start gap-2'>
              <img src={memoIcon} alt='' className='mt-0.5 h-4 w-4 shrink-0' />
              <p className='truncate whitespace-pre-wrap text-body-md text-grey-700'>
                <span>메모가이드: </span>
                {displayData.memo}
              </p>
            </div>
          )}

          {/* 서비스 준비 중 섹션 */}
          <div className='mt-5 rounded-2xl bg-grey-50 py-12'>
            <EmptyNotice
              title='서비스 준비 중입니다'
              subtitle='빠른 시일 내에 만나요 :)'
            />
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div
          ref={bottomBarRef}
          className='fixed bottom-0 left-0 right-0 z-20 flex items-center gap-4 bg-white px-5 pb-[8px] pt-3'
        >
          <CtaButton
            onClick={handleLinkClick}
            className='flex-1'
            disabled={isInout}
          >
            링크 바로가기
          </CtaButton>

          <button
            onClick={handleComplete}
            className='flex w-[49px] shrink-0 flex-col items-center'
          >
            <CheckIcon
              className={`h-8 w-8 ${isCompleted ? 'text-point' : 'text-grey-400'}`}
            />
            <span
              className={`text-body-lg ${isCompleted ? 'text-point' : 'text-grey-400'}`}
            >
              완료하기
            </span>
          </button>
        </div>
      </main>

      {/* 로그인 토스트 */}
      {loginToast.isVisible && (
        <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
          <Toast
            message={loginToast.message}
            actionLabel='로그인'
            onAction={() => navigate(ROUTES.login)}
          />
        </div>
      )}

      {/* 튜토리얼 토스트 */}
      {tutorialToast.isVisible && (
        <div className='fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2'>
          <Toast
            message={tutorialToast.message}
            actionLabel='확인'
            onClose={tutorialToast.hideToast}
          />
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;
