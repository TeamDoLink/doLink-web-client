import linkIcon from '@/assets/icons/common/clip-12.svg';
import shareIcon from '@/assets/icons/common/share-12.svg';

interface LinkActionButtonsProps {
  /** 비활성화 상태 여부 */
  disabled?: boolean;
  /** 원본 보기 클릭 핸들러 */
  onClickOriginal?: () => void;
  /** 공유 클릭 핸들러 */
  onClickShare?: () => void;
}

/**
 * 링크 관련 액션 버튼 그룹 (원본 보기 + 공유)
 * disabled prop으로 활성/비활성 스타일 제어
 */
export const LinkActionButtons = ({
  disabled = false,
  onClickOriginal,
  onClickShare,
}: LinkActionButtonsProps) => {
  // 스타일 variant 계산
  const buttonClass = disabled
    ? 'bg-grey-50 text-grey-300 cursor-not-allowed' // 비활성
    : 'bg-white text-grey-700 hover:bg-grey-50 cursor-pointer'; // 활성

  return (
    <div className='flex gap-2'>
      {/* 원본 버튼 */}
      <button
        type='button'
        disabled={disabled}
        onClick={onClickOriginal}
        className={`flex items-center gap-1.5 rounded-full px-[10px] py-[5px] text-body-sm transition-colors ${buttonClass}`}
      >
        <img src={linkIcon} alt='' className='h-5 w-5' aria-hidden />
        <span>원본</span>
      </button>

      {/* 공유 버튼 */}
      <button
        type='button'
        disabled={disabled}
        onClick={onClickShare}
        className={`flex items-center gap-1.5 rounded-full px-[10px] py-[5px] text-body-sm transition-colors ${buttonClass}`}
      >
        <img src={shareIcon} alt='' className='h-5 w-5' aria-hidden />
        <span>공유</span>
      </button>
    </div>
  );
};
