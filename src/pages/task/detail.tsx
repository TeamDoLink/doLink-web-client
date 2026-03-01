import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { BackDetailBar } from '@/components/common/appBar/backDetailAppBar';
import { GreyLine } from '@/components/common/line/greyLine';
import { CtaButton } from '@/components/common/button/ctaButton';
import { CheckIcon } from '@/components/common/icons/checkIcon';
import { OptionMenu } from '@/components/common/menu/optionMenu';
import EmptyNotice from '@/components/common/feedBack/emptyNotice';
import { FeedBack } from '@/components/common';
import ModalLayout from '@/components/common/feedBack/modalLayout';
import { openLink, isReactNativeWebView } from '@/utils/nativeBridge';
import { ROUTES } from '@/constants/routes';
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
  const queryClient = useQueryClient();
  const taskId = Number(id);

  // API 호출
  const { data: taskResponse, isLoading: isLoadingTask } = useGetTask(taskId);
  const apiTaskResponse = taskResponse as unknown as ApiResponseTaskResponse;
  const taskData = apiTaskResponse?.result;
  const collectionId = taskData?.collectionId;

  const { data: collectionResponse, isLoading: isLoadingCollection } =
    useGetCollectDetail(collectionId ?? 0, {
      query: { enabled: !!collectionId },
    });
  const apiCollectionResponse =
    collectionResponse as unknown as ApiResponseCollectionDetailResponse;
  const collectionData = apiCollectionResponse?.result;

  const { mutate: completeTask } = useCompleteTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [imageError, setImageError] = useState(false);
  const [appBarHeight, setAppBarHeight] = useState(56);
  const [bottomHeight, setBottomHeight] = useState(104);
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const appBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const isCompleted = taskData?.status ?? false;
  const categoryLabel = collectionData?.category ?? '';
  const categoryIcon = CATEGORY_ICON_MAP[categoryLabel] ?? etcIcon;
  const isInout = taskData?.inout ?? false; // inout 필드: true면 외부에서 등록, false면 앱 내부에서 등록

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
      navigate(`${ROUTES.taskEdit}/${taskId}`);
    } else if (key === 'delete') {
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
    // inout이 false면 링크 이동 불가
    if (!isInout) {
      return;
    }

    if (taskData?.link) {
      // React Native 환경에서는 네이티브 브릿지 사용
      if (isReactNativeWebView()) {
        openLink(taskData.link);
      } else {
        // 웹 브라우저 환경에서는 새 탭으로 열기
        window.open(taskData.link, '_blank');
      }
    }
  };

  const handleComplete = () => {
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

  if (isLoadingTask || isLoadingCollection) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-body-lg text-grey-600'>로딩 중...</p>
      </div>
    );
  }

  if (!taskData) {
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
          {taskData.thumbnailUrl && !imageError ? (
            <img
              src={taskData.thumbnailUrl}
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
          <h1 className='text-heading-xl text-black'>{taskData.title}</h1>

          {/* 모음 제목 */}
          <p className='text-body-xl text-black'>
            {collectionData?.name ?? '모음 없음'}
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
              {taskData.createdAt
                ? formatRelativeDateLabel(taskData.createdAt)
                : '날짜 없음'}
            </span>
          </div>

          {/* 메모 */}
          {taskData.memo && (
            <div className='flex items-start gap-2'>
              <img src={memoIcon} alt='' className='mt-0.5 h-4 w-4 shrink-0' />
              <p className='truncate whitespace-pre-wrap text-body-md text-grey-700'>
                <span>메모가이드: </span>
                {taskData.memo}
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
            disabled={!isInout}
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
    </div>
  );
};

export default TaskDetailPage;
