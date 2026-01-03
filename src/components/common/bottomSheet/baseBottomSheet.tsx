import { useRef, useState } from 'react';
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  PropsWithChildren,
} from 'react';

const DEFAULT_DISMISS_THRESHOLD = 80;

interface BaseBottomSheetProps extends PropsWithChildren {
  onClose: () => void;
  dismissThreshold?: number;
  className?: string;
  contentClassName?: string;
}

/**
 * 공통 바텀시트 래퍼 컴포넌트
 * 드래그 제스처 처리 및 닫기 애니메이션 담당
 * UI는 children을 통해 구성
 */
export const BaseBottomSheet = ({
  onClose,
  dismissThreshold = DEFAULT_DISMISS_THRESHOLD,
  className = '',
  contentClassName = '',
  children,
}: BaseBottomSheetProps) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (isClosing) return;
    startYRef.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!isDragging || startYRef.current === null) return;
    const delta = Math.max(0, event.clientY - startYRef.current);
    setDragOffset(delta);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!isDragging) return;
    event.currentTarget.releasePointerCapture(event.pointerId);

    const shouldDismiss = dragOffset > dismissThreshold;
    setIsDragging(false);
    startYRef.current = null;

    if (shouldDismiss) {
      setIsClosing(true);
      const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
      setDragOffset(sheetHeight);
    } else {
      setDragOffset(0);
    }
  };

  const handleTransitionEnd = () => {
    if (!isClosing) return;
    setIsClosing(false);
    onClose();
  };

  const sheetStyle: CSSProperties = {
    transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
  };

  return (
    <div
      ref={sheetRef}
      className={`w-full rounded-t-3xl bg-white px-5 pb-6 pt-5 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] ${className}`}
      style={sheetStyle}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className='mb-4 flex justify-center'>
        <span
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className='h-1 w-12 cursor-grab rounded-[2px] bg-[#D2D9DD] active:cursor-grabbing'
        />
      </div>

      <div className={`flex flex-col gap-4 ${contentClassName}`.trim()}>
        {children}
      </div>
    </div>
  );
};

export default BaseBottomSheet;
