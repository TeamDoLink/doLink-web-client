import closeIcon from '@/assets/icons/common/close-24.svg';

export type ClearButtonProps = {
  /** 클릭 시 호출되는 콜백 */
  onClick: () => void;
  /** 접근성 레이블 (기본값: "clear") */
  ariaLabel?: string;
  /** Tailwind width/height 클래스 */
  sizeClass?: string;
};

export default function ClearButton({
  onClick,
  ariaLabel = 'clear',
}: ClearButtonProps) {
  return (
    <button
      type='button'
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={`flex items-center justify-center rounded-full text-grey-700`}
    >
      <img src={closeIcon} alt='' className={'h-[20px] w-[20px]'} />
    </button>
  );
}
