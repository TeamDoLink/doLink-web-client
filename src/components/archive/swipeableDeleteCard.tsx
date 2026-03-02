import { useState, useRef, useEffect } from 'react';
import { Button, List } from '@/components/common';

// 피그마상에 20*22 아이콘 없어 svg로 적용함
const DeleteIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='22'
      viewBox='0 0 20 22'
      fill='none'
    >
      <path
        d='M15.5 5C16.8807 5 18 6.11929 18 7.5V19.5C18 20.8807 16.8807 22 15.5 22H4.5C3.11929 22 2 20.8807 2 19.5V7.5C2 6.11929 3.11929 5 4.5 5H15.5ZM7.5 10C6.94772 10 6.5 10.4477 6.5 11V16C6.5 16.5523 6.94772 17 7.5 17C8.05228 17 8.5 16.5523 8.5 16V11C8.5 10.4477 8.05228 10 7.5 10ZM12.5 10C11.9477 10 11.5 10.4477 11.5 11V16C11.5 16.5523 11.9477 17 12.5 17C13.0523 17 13.5 16.5523 13.5 16V11C13.5 10.4477 13.0523 10 12.5 10Z'
        fill='#8A8DA0'
      />
      <rect y='4' width='20' height='4' rx='2' fill='#8A8DA0' />
      <rect
        x='6'
        y='1'
        width='8'
        height='6'
        rx='2'
        stroke='#8A8DA0'
        strokeWidth='2'
      />
    </svg>
  );
};

/**
 * Task 타입 정의 (임시 - 나중에 types 폴더로 이동)
 */
export interface Task {
  taskId: number;
  title: string;
  link: string | null;
  memo: string | null;
  status: boolean;
  inout: boolean;
  isTutorial?: boolean;
  createdAt: string;
  modifiedAt: string;
  thumbnailUrl?: string | null;
}

/**
 * SwipeableDeleteCard Props
 * 스와이프로 삭제 가능한 링크 카드 컴포넌트의 속성 정의
 */
interface SwipeableDeleteCardProps {
  /** Task 정보 배열 - 같은 날짜에 생성된 Task들 */
  tasks: Task[];
  /** 생성 날짜 - 이 카드에 속한 모든 링크의 공통 생성 날짜 */
  createdAt: Date;
  /** 각 링크의 체크박스 상태를 저장한 객체 (linkId를 키로 사용) */
  linkStates: Record<number, boolean>;
  /** 각 링크의 수정 모드 상태를 저장한 객체 (linkId를 키로 사용) */
  linkEditModes: Record<number, boolean>;
  /** 체크박스 상태 변경 시 호출되는 콜백 함수 */
  onCheck: (linkId: number, checked: boolean) => void;
  /** 수정 모드 상태 변경 시 호출되는 콜백 함수 */
  onEditModeChange: (isEditMode: boolean) => void;
  /** '원본 보기' 버튼 클릭 시 호출되는 콜백 함수 */
  onOriginalClick: (linkId: number) => void;
  /** '공유' 버튼 클릭 시 호출되는 콜백 함수 */
  onShareClick: (linkId: number) => void;
  /** '편집' 버튼 클릭 시 호출되는 콜백 함수 */
  onEditClick: (linkId: number) => void;
  /** '삭제' 버튼 클릭 시 호출되는 콜백 함수 */
  onDeleteClick: (linkId: number) => void;
  /** 카드 단위 삭제 버튼 클릭 시 호출되는 콜백 함수 (선택) */
  onDeleteGroup?: (linkIds: number[]) => void;
  /** 할 일 카드 클릭 시 호출되는 콜백 함수 (선택) */
  onTaskClick?: (taskId: number) => void;
  /** 캡슐 버튼 및 체크박스 비활성화 여부 */
  capsuleDisabled?: boolean;
}

/**
 * 날짜를 "N일 전" 또는 "yyyy.mm.dd" 형식으로 변환하는 헬퍼 함수
 * @param date - 변환할 날짜
 * @returns 날짜 문자열
 * - 0일 (당일): "오늘"
 * - 1~7일: "n일 전"
 * - 7일 이후: "yyyy.mm.dd"
 */
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 0일 (당일 등록 건) → "오늘"
  if (diffDays === 0) return '오늘';

  // 1~7일 → "n일 전"
  if (diffDays >= 1 && diffDays <= 7) {
    return `${diffDays}일 전`;
  }

  // 7일 이후 → "yyyy.mm.dd" 형식으로 표시
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

/**
 * 같은 날짜에 생성된 링크들을 그룹화하여 표시하는 카드 컴포넌트
 * - 상단에 공통 생성 날짜와 편집 버튼 표시
 * - 하단에 List.LinkItem 컴포넌트를 사용하여 여러 링크 정보 표시
 * - 편집 버튼 클릭 시 해당 카드의 모든 링크에 대해 수정 모드 활성화
 */
export const SwipeableDeleteCard = ({
  tasks,
  createdAt,
  linkStates,
  linkEditModes,
  onCheck,
  onEditModeChange,
  onOriginalClick,
  onShareClick,
  onEditClick,
  onDeleteClick,
  onDeleteGroup,
  onTaskClick,
  capsuleDisabled = false,
}: SwipeableDeleteCardProps) => {
  // Task를 LinkItem 형식으로 변환
  const links = tasks.map((task) => ({
    id: task.taskId,
    title: task.title,
    subtitle: task.link || '직접 추가',
    inout: task.inout, // inout 필드 추가
    thumbnail: task.thumbnailUrl,
  }));

  // 스와이프 상태 관리
  const [swipeOffset, setSwipeOffset] = useState(0); // 현재 스와이프 오프셋
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부
  const startX = useRef(0); // 터치/마우스 시작 X 좌표
  const currentX = useRef(0); // 현재 터치/마우스 X 좌표
  const cardRef = useRef<HTMLDivElement>(null); // 카드 요소 참조

  const SWIPE_THRESHOLD = 44; // 스와이프 임계값 (Figma 디자인에서 44px)

  // 외부 클릭 시 스와이프 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        swipeOffset > 0 &&
        cardRef.current &&
        !cardRef.current.contains(event.target as Node)
      ) {
        setSwipeOffset(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [swipeOffset]);

  /**
   * 편집 버튼 클릭 핸들러
   * isEditMode를 true로 설정하여 수정 모드 활성화
   */
  const handleEditClick = () => {
    if (capsuleDisabled) {
      return;
    }
    onEditModeChange(true);
  };

  /**
   * 카드 클릭 핸들러
   * edit/delete 버튼이 아닌 영역을 클릭했을 때 모든 children의 editMode를 false로 변경
   */
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Edit/Delete 버튼 클릭인지 확인
    const isEditOrDeleteButton =
      (target.tagName === 'IMG' &&
        (target.getAttribute('alt') === 'edit' ||
          target.getAttribute('alt') === 'delete')) ||
      (target.tagName === 'BUTTON' &&
        target.querySelector('img[alt="edit"], img[alt="delete"]'));

    // Edit/Delete 버튼이면 editMode를 유지
    if (isEditOrDeleteButton) {
      return;
    }

    // 현재 editMode가 true인 child가 있는지 확인
    const hasEditModeActive = links.some((link) => linkEditModes[link.id]);

    if (hasEditModeActive) {
      onEditModeChange(false);
    }
  };

  /**
   * 터치/마우스 다운 핸들러
   * 스와이프 시작 지점을 기록
   */
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    startX.current =
      'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    currentX.current = startX.current;
  };

  /**
   * 터치/마우스 이동 핸들러
   * 스와이프 거리를 계산하여 카드를 이동
   */
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    currentX.current =
      'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = currentX.current - startX.current;

    // 오른쪽으로만 스와이프 가능 (양수 값만)
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, SWIPE_THRESHOLD));
    } else {
      // 왼쪽으로 스와이프 시 원위치로
      setSwipeOffset(0);
    }
  };

  /**
   * 터치/마우스 업 핸들러
   * 스와이프가 임계값을 넘으면 열린 상태 유지, 아니면 원위치
   */
  const handleTouchEnd = () => {
    setIsDragging(false);

    // 임계값의 절반 이상 스와이프하면 열림, 아니면 닫힘
    if (swipeOffset > SWIPE_THRESHOLD / 2) {
      setSwipeOffset(SWIPE_THRESHOLD);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleDeleteGroup = () => {
    const ids = links.map((link) => link.id);

    if (onDeleteGroup) {
      onDeleteGroup(ids);
    } else {
      ids.forEach((id) => onDeleteClick(id));
    }
    setSwipeOffset(0);
  };

  return (
    <div className='relative overflow-hidden rounded-[12px]'>
      {/* 삭제 버튼 (카드 뒤에 배치) */}
      <div className='absolute left-0 top-0 flex h-full items-center justify-center'>
        <button
          onClick={handleDeleteGroup}
          className='flex h-8 w-8 items-center justify-center px-[6px] pb-[5px] pt-[6px]'
          aria-label='삭제'
        >
          <DeleteIcon />
        </button>
      </div>

      {/* 메인 카드 (스와이프 가능) */}
      <div
        ref={cardRef}
        className='flex flex-col rounded-[12px] bg-white shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] transition-transform'
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => {
          if (isDragging) {
            handleTouchEnd();
          }
        }}
      >
        {/* 상단 헤더: 생성 날짜 및 편집 버튼 */}
        <div className='flex w-full items-center justify-between px-5 pb-2 pt-4 text-caption-md'>
          <p className='text-grey-800'>{formatRelativeTime(createdAt)}</p>
          <Button.TextButton
            onClick={handleEditClick}
            disabled={capsuleDisabled}
            className='text-caption-md'
          >
            편집
          </Button.TextButton>
        </div>

        {/* 링크 아이템 리스트: 같은 날짜의 모든 링크를 List.LinkItem으로 렌더링 */}
        <div className='flex flex-col gap-5 px-5 pb-5'>
          {links.map((link, index) => (
            <List.LinkItem
              key={link.id}
              title={link.title} // 링크 제목
              subtitle={link.subtitle} // 링크 부제목 (URL 등)
              thumbnail={link.thumbnail} // 썸네일 이미지
              checked={linkStates[link.id]} // 체크박스 상태
              isEditMode={linkEditModes[link.id]} // 수정 모드 상태
              onChange={(checked) => onCheck(link.id, checked)} // 체크박스 변경 핸들러
              onClick={() => onTaskClick?.(link.id)} // 할 일 클릭 핸들러
              onOriginalClick={() => onOriginalClick(link.id)} // 원본 보기 클릭 핸들러
              onShareClick={() => onShareClick(link.id)} // 공유 클릭 핸들러
              onEditClick={() => onEditClick(link.id)} // 편집 클릭 핸들러
              onDeleteClick={() => onDeleteClick(link.id)} // 삭제 클릭 핸들러
              width='w-full' // 전체 너비 사용
              actionDisabled={capsuleDisabled}
              originalDisabled={!tasks[index].inout} // inout이 false면 원본 버튼 비활성화
            />
          ))}
        </div>
      </div>
    </div>
  );
};
