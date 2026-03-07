export type ConfirmDialogProps = {
  title: string;
  subtitle?: string;
  positiveLabel: string;
  negativeLabel?: string;
  onPositive: () => void;
  onNegative?: () => void;
};

export default function ConfirmDialog({
  title,
  subtitle,
  positiveLabel,
  negativeLabel,
  onPositive,
  onNegative,
}: ConfirmDialogProps) {
  return (
    // TODO 근사값으로 맞춰놓음 디자이너분들과 논의 후 수정 예정
    <div className='flex w-[295px] flex-col gap-7 rounded-2xl bg-white px-5 py-6'>
      {/* Text Section */}
      <div className='flex w-full flex-col gap-2'>
        <p className='w-full text-heading-lg text-black'>{title}</p>
        {subtitle && (
          <p className='w-full text-body-md text-grey-500'>{subtitle}</p>
        )}
      </div>
      {/* Button Section */}
      <div className='flex w-full flex-col items-center gap-3'>
        {/* Primary CTA Button */}
        <button
          type='button'
          onClick={onPositive}
          className='flex h-11 w-full items-center justify-center rounded-[10px] bg-point text-body-xl text-white'
        >
          {positiveLabel}
        </button>

        {/* Secondary Text Button */}
        {negativeLabel && onNegative && (
          <button
            onClick={onNegative}
            className='w-full text-center text-body-lg text-grey-800'
          >
            {negativeLabel}
          </button>
        )}
      </div>
    </div>
  );
}
