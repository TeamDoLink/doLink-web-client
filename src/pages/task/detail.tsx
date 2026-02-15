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
} from '@/api/generated/endpoints/task/task';
import { useGetCollectDetail } from '@/api/generated/endpoints/collection/collection';
import type {
  ApiResponseTaskResponse,
  ApiResponseCollectionDetailResponse,
} from '@/api/generated/models';

// 아이콘
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
import calendarIcon from '@/assets/icons/category/detail/calendar.svg';
import memoIcon from '@/assets/icons/category/detail/memo.svg';

const CATEGORY_ICON_MAP: Record<string, string> = {
  맛집: restaurantIcon,
  취미: hobbyIcon,
  여행: travelIcon,
  '재테크/금융': moneyIcon,
  쇼핑: shoppingIcon,
  운동: exerciseIcon,
  '진로/취업': careerIcon,
  공부: studyIcon,
  '생활 꿀팁': tipsIcon,
  기타: etcIcon,
  투두: todoIcon,
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
          queryClient.invalidateQueries({
            queryKey: getGetTaskQueryKey(taskId),
          });
          setIsDeleteModalOpen(false);
          navigate(-1);
        },
      }
    );
  };

  const handleLinkClick = () => {
    if (taskData?.link) {
      if (isReactNativeWebView()) {
        openLink(taskData.link);
      } else {
        window.open(taskData.link, '_blank');
      }
    }
  };

  const handleComplete = () => {
    completeTask(
      { taskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetTaskQueryKey(taskId),
          });
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
    <div className='relative flex min-h-screen flex-col bg-white'>
      <main>
        {/* 헤더 */}
        <div ref={appBarRef} className='sticky top-0 z-20 bg-white'>
          <BackDetailBar
            title='할 일 상세'
            rightIcons={['option']}
            onClickBack={handleBack}
            onClickOption={handleOption}
          />
        </div>

        {/* 옵션 메뉴 */}
        {isOptionMenuOpen && (
          <>
            <div
              className='fixed inset-0 z-40 bg-transparent'
              onClick={() => setIsOptionMenuOpen(false)}
            />
            <div className='fixed right-5 top-16 z-50'>
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

        {/* 본문 */}
        <div
          className='overflow-y-auto px-5 pt-8'
          style={{
            paddingBottom: `${bottomHeight + 16}px`,
            minHeight: `calc(100vh - ${appBarHeight}px)`,
          }}
        >
          {/* 제목 */}
          <h1 className='mb-6 text-body-xl font-semibold text-black'>
            {taskData.title}
          </h1>

          {/* 썸네일 */}
          {taskData.thumbnailUrl && !imageError && (
            <div className='mb-6'>
              <img
                src={taskData.thumbnailUrl}
                alt=''
                className='h-auto w-full rounded-2xl object-cover'
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {/* 모음 제목 */}
          <div className='mb-3 rounded-2xl bg-grey-50 px-4 py-3'>
            <span className='text-body-md text-grey-700'>
              {collectionData?.name ?? '모음 없음'}
            </span>
          </div>

          <GreyLine />

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
                ? new Date(taskData.createdAt).toLocaleDateString('ko-KR')
                : '날짜 없음'}
            </span>
          </div>

          {/* 메모 */}
          {taskData.memo && (
            <div className='flex items-start gap-2'>
              <img src={memoIcon} alt='' className='mt-0.5 h-4 w-4 shrink-0' />
              <p className='truncate whitespace-pre-wrap text-body-md text-grey-700'>
                {taskData.memo}
              </p>
            </div>
          )}

          {/* 서비스 준비 중 섹션 */}
          <div className='rounded-2xl bg-grey-50 py-12'>
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
          <CtaButton onClick={handleLinkClick} className='flex-1'>
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
