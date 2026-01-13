import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackDetailBar } from '@/components/common/appBar/backDetailAppBar';
import { GreyLine } from '@/components/common/line/greyLine';
import { CtaButton } from '@/components/common/button/ctaButton';
import { CheckIcon } from '@/components/common/icons/checkIcon';
import { OptionMenu } from '@/components/common/menu/optionMenu';
import EmptyNotice from '@/components/common/feedBack/emptyNotice';
import { openLink, isReactNativeWebView } from '@/utils/nativeBridge';

// 아이콘
import imgNoData from '@/assets/icons/common/no-img-data.svg';
import restaurantIcon from '@/assets/icons/category/detail/restaurant.svg';
import calendarIcon from '@/assets/icons/category/detail/calendar.svg';
import memoIcon from '@/assets/icons/category/detail/memo.svg';

// TODO: 임시 데이터 - 실제로는 API 또는 라우팅 파라미터로 받아올 예정
// API 응답 예시:
// {
//   taskId: number;
//   title: string;
//   archiveTitle: string;
//   category: string;
//   thumbnail: string | null; // link URL에서 추출한 썸네일 (Open Graph image 등)
//   addedDate: string;
//   memo: string;
//   link: string;
//   isCompleted: boolean;
// }

// TODO : 임시 데이터 API 연동 후 제거
const MOCK_TASK_DATA = {
  taskId: 1,
  title: '스카이트리 근처 맛집 모음',
  archiveTitle: '2025 2월 도쿄 여행',
  category: '맛집',
  categoryIcon: restaurantIcon,
  thumbnail: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', // link에서 추출된 썸네일 이미지
  addedDate: '2일 전 추가',
  // memo: '1. 스카이트리 근처 설명서에 가격 확인하기\n2. 매드 가이드는 최대 4층 누룽지/저수 최대 100차 기계 가는게너닝나다\n알이삭으욕활만구달만이삭으욕활만구달만이삭으욕활만구달만이삭으욕활만구달만이삭으욕활만구달만이',
  memo: '',
  link: 'https://www.youtube.com/watch?v=f7GrX2-rUOs&list=RDf7GrX2-rUOs&start_radio=1',
  isCompleted: false,
};

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(MOCK_TASK_DATA.isCompleted);
  const [imageError, setImageError] = useState(false);
  const [appBarHeight, setAppBarHeight] = useState(56); // 초기값: 앱바 예상 높이
  const [bottomHeight, setBottomHeight] = useState(104); // 초기값: 하단 버튼 영역 예상 높이
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const appBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

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
      console.log('할 일 수정');
      // TODO: 할 일 수정 로직 구현
    } else if (key === 'delete') {
      console.log('할 일 삭제');
      // TODO: 할 일 삭제 로직 구현
    }
    setIsOptionMenuOpen(false);
  };

  const handleLinkClick = () => {
    if (MOCK_TASK_DATA.link) {
      if (isReactNativeWebView()) {
        // React Native 환경에서는 네이티브 브릿지 사용
        openLink(MOCK_TASK_DATA.link);
      } else {
        // 웹 브라우저 환경에서는 새 탭으로 열기
        window.open(MOCK_TASK_DATA.link, '_blank');
      }
    }
  };

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    console.log('할 일 완료 토글:', !isCompleted);
    // TODO: API 호출로 완료 상태 업데이트
  };

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
          {MOCK_TASK_DATA.thumbnail && !imageError ? (
            <img
              src={MOCK_TASK_DATA.thumbnail}
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
          className='relative z-10 -mt-4 flex flex-col gap-4 bg-white px-5 py-6'
          style={{
            // 계산식: 화면 전체 높이 - 앱바 높이  - 하단 버튼 높이
            minHeight: `calc(100vh - ${appBarHeight}px  - ${bottomHeight}px)`,
          }}
        >
          {/* 제목 */}
          <h1 className='text-heading-lg text-grey-900'>
            {MOCK_TASK_DATA.title}
          </h1>

          {/* 모음 제목 */}
          <p className='text-body-md text-grey-600'>
            {MOCK_TASK_DATA.archiveTitle}
          </p>

          <GreyLine />

          {/* 카테고리 */}
          <div className='flex items-center gap-2'>
            <img
              src={MOCK_TASK_DATA.categoryIcon}
              alt=''
              className='h-4 w-4 shrink-0'
            />
            <span className='text-body-md text-grey-700'>
              {MOCK_TASK_DATA.category}
            </span>
          </div>

          {/* 추가 날짜 */}
          <div className='flex items-center gap-2'>
            <img src={calendarIcon} alt='' className='h-4 w-4 shrink-0' />
            <span className='text-body-md text-grey-700'>
              {MOCK_TASK_DATA.addedDate}
            </span>
          </div>

          {/* 메모 */}
          {MOCK_TASK_DATA.memo && (
            <div className='flex items-start gap-2'>
              <img src={memoIcon} alt='' className='mt-0.5 h-4 w-4 shrink-0' />
              <p className='truncate whitespace-pre-wrap text-body-md text-grey-700'>
                {MOCK_TASK_DATA.memo}
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
