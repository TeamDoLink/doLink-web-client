import { useEffect, useRef, type ReactNode } from 'react';

interface InfiniteScrollListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onLoadMore: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  keyExtractor: (item: T) => string | number;
  className?: string;
}

export const InfiniteScrollList = <T,>({
  items,
  renderItem,
  onLoadMore,
  hasNextPage = false,
  isFetchingNextPage = false,
  isLoading = false,
  isError = false,
  emptyMessage = '항목이 없습니다',
  loadingMessage = '불러오는 중...',
  errorMessage = '에러가 발생했습니다',
  keyExtractor,
  className = '',
}: InfiniteScrollListProps<T>) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        onLoadMore();
      }
    });

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, isLoading, onLoadMore]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <p className='text-gray-500'>{loadingMessage}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center py-8'>
        <p className='text-red-500'>{errorMessage}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='flex items-center justify-center py-8'>
        <p className='text-gray-500'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
      ))}

      {/* 감지 영역 */}
      <div ref={lastElementRef} className='h-6' />

      {isFetchingNextPage && (
        <div className='py-4 text-center text-gray-500'>{loadingMessage}</div>
      )}
    </div>
  );
};
