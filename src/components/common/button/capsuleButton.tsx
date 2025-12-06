import linkIcon from '@/assets/icons/common/clip-12.svg';
import shareIcon from '@/assets/icons/common/share-12.svg';

type CapsuleActionProps = {
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
  iconSrc?: string;
};

interface CapsuleButtonProps {
  /** 컴포넌트 전체 래퍼 클래스 */
  className?: string;
  /** 원본 버튼 설정 */
  original?: CapsuleActionProps;
  /** 공유 버튼 설정 */
  share?: CapsuleActionProps;
}

/**
 * 링크 관련 액션 버튼 그룹 (원본 보기 + 공유)
 * 각 버튼에 개별 상태/핸들러 지정 가능
 */
export const CapsuleButton = ({
  className = '',
  original,
  share,
}: CapsuleButtonProps) => {
  const {
    disabled: originalDisabled = false,
    onClick: onClickOriginal,
    label: originalLabel = '원본',
    iconSrc: originalIcon = linkIcon,
  } = original ?? {};

  const {
    disabled: shareDisabled = false,
    onClick: onClickShare,
    label: shareLabel = '공유',
    iconSrc: shareIconSrc = shareIcon,
  } = share ?? {};

  const baseClass =
    'flex items-center gap-1.5 rounded-full border border-grey-200 px-[10px] py-[5px] text-body-sm transition-colors';

  const resolveVariant = (disabled: boolean) =>
    disabled
      ? 'bg-grey-50 text-grey-300 cursor-not-allowed'
      : 'bg-white text-grey-700 hover:bg-grey-50 cursor-pointer';

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        type='button'
        disabled={originalDisabled}
        onClick={onClickOriginal}
        className={`${baseClass} ${resolveVariant(originalDisabled)}`}
      >
        <img src={originalIcon} alt='' className='h-5 w-5' aria-hidden />
        <span>{originalLabel}</span>
      </button>

      <button
        type='button'
        disabled={shareDisabled}
        onClick={onClickShare}
        className={`${baseClass} ${resolveVariant(shareDisabled)}`}
      >
        <img src={shareIconSrc} alt='' className='h-5 w-5' aria-hidden />
        <span>{shareLabel}</span>
      </button>
    </div>
  );
};
