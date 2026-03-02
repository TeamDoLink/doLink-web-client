import shareIcon from '@/assets/icons/common/share-12.svg';

type ShareCapsuleButtonProps = {
  className?: string;
  disabled?: boolean;
  label?: string;
  iconSrc?: string;
  onClick?: () => void;
};

const baseClass =
  'flex items-center gap-1.5 rounded-full border border-grey-200 px-[10px] py-[5px] text-body-sm transition-colors';

const resolveVariant = (disabled: boolean) =>
  disabled
    ? 'bg-grey-50 text-grey-300 cursor-not-allowed'
    : 'bg-white text-grey-700 [@media(hover:hover)]:hover:bg-grey-50 active:bg-grey-100 cursor-pointer';

export const ShareCapsuleButton = ({
  className = '',
  disabled = false,
  label = '공유',
  iconSrc = shareIcon,
  onClick,
}: ShareCapsuleButtonProps) => {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${resolveVariant(disabled)} ${className}`}
    >
      <img src={iconSrc} alt='' className='h-5 w-5' aria-hidden />
      <span>{label}</span>
    </button>
  );
};
