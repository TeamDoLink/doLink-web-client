import { useRef, useState } from 'react';
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  PropsWithChildren,
} from 'react';
import plusIcon from '@/assets/icons/common/plus.svg';

interface TodoBottomSheetProps extends PropsWithChildren {
  title: string;
  onClickAddCollection?: () => void;
  onClose?: () => void;
  dismissThreshold?: number;
}

/**
 * 할 일 담기 BottomSheet 컨테이너 컴포넌트
 * 드래그 핸들을 통해 아래로 스와이프하여 닫는 기능 구현
 */

export const TodoBottomSheet = ({
  title,
  onClickAddCollection,
  onClose,
  dismissThreshold = 80,
  children,
}: TodoBottomSheetProps) => {
  // 드래그로 인해 아래로 밀린 Y축 거리 상태
  const [dragOffset, setDragOffset] = useState(0);
  // 현재 드래그 중인지 여부 상태
  const [isDragging, setIsDragging] = useState(false);
  // 닫히는 애니메이션이 진행 중인지 여부 상태
  const [isClosing, setIsClosing] = useState(false);
  // 드래그 시작 지점의 Y축 위치를 지정하기 위한 Ref
  const startYRef = useRef<number | null>(null);
  // 바텀시트 DOM 요소에 접근해 높이를 계산하기 위한 Ref
  const sheetRef = useRef<HTMLDivElement>(null);

  // 드래그 시작 핸들러 함수
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // 닫기 애니메이션 중이면 무시
    if (isClosing) return;
    // 시작 Y 좌표 저장
    startYRef.current = event.clientY;
    // 드래그 상태 활성화
    setIsDragging(true);
    // 포인터 캡쳐: 포인터가 요소 밖으로 나가도 이 요소가 이벤트를 계속 받게 함
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  // 드래그 중 핸들러 함수
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    // 드래그 중이 아니면 무시
    if (!isDragging || startYRef.current === null) return;
    // Y축 이동 거리 계산 (지금 위치 - 처음 위치)
    const delta = Math.max(0, event.clientY - startYRef.current);
    setDragOffset(delta);
  };

  // 드래그 종료 핸들러 함수
  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    // 드래그 중이 아니면 무시
    if (!isDragging) return;
    event.currentTarget.releasePointerCapture(event.pointerId);

    // 닫기 임계값 초과 여부 판단
    const shouldDismiss = dragOffset > dismissThreshold;
    // 드래그 상태 해제
    setIsDragging(false);
    startYRef.current = null;

    if (shouldDismiss) {
      // 닫기 결정 시: 닫기 애니메이션 시작
      setIsClosing(true);
      // 시트의 전체 높이를 계산해 화면 밖으로 밀어냄
      const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
      setDragOffset(sheetHeight);
    } else {
      // 원래 위치로 복귀 결정 시
      setDragOffset(0);
    }
  };

  // CSS transition이 끝나면 호출되는 핸들러
  const handleTransitionEnd = () => {
    // 닫기 애니메이션이 끝난 경우에 처리
    if (!isClosing) return;
    // 닫힘 상태 해제 및 외부 onClose 콜백 호출
    setIsClosing(false);
    onClose?.();
  };

  // 바텀시트 컨테이너에 적용된 동적 스타일
  const sheetStyle: CSSProperties = {
    transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
  };

  return (
    <div
      ref={sheetRef}
      className='w-full rounded-t-3xl bg-white p-6 pt-4 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]'
      style={sheetStyle}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className='flex flex-col gap-3'>
        {/* 드래그 핸들 영역 */}
        <div className='flex justify-center'>
          {/* 드래그 이벤트 리스너 연결 */}
          <span
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            // 드래그 핸들 스타일 및 커서 지정
            className='h-1 w-12 cursor-grab rounded-[2px] bg-[#D2D9DD] active:cursor-grabbing'
          />
        </div>

        {/* 헤더 영역 (제목 + 모음 추가 버튼) */}
        <div className='flex items-center justify-between'>
          <h2 className='text-heading-xl text-black'>{title}</h2>
          {/* 모음 추가 버튼 */}
          <button
            type='button'
            onClick={onClickAddCollection}
            className='inline-flex items-center gap-1 text-caption-md text-grey-500'
          >
            <img src={plusIcon} alt='' className='h-3 w-3' aria-hidden />
            <span>모음 추가</span>
          </button>
        </div>
      </div>

      {/* 바텀시트 콘텐츠 영역 */}
      <div className='mt-4'>{children}</div>
    </div>
  );
};
