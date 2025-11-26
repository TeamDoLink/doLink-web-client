export type AlertDialogProps = {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export default function AlertDialog({
  title,
  subtitle,
  primaryLabel = 'Positive',
  secondaryLabel = '텍스트버튼',
  onPrimary,
  onSecondary,
}: AlertDialogProps) {
  return (
    // TODO 근사값으로 맞춰놓음 디자이너분들과 논의 후 수정 예정
    <div className='flex w-96 flex-col gap-7 rounded-2xl bg-white px-5 py-6 shadow-xl'>
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
          onClick={onPrimary}
          className='flex h-11 w-full items-center justify-center rounded-lg bg-point text-body-lg text-white'
        >
          {primaryLabel}
        </button>

        {/* Secondary Text Button with Underline */}
        <button
          onClick={onSecondary}
          className='w-full text-center text-body-lg text-grey-800 underline'
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}
