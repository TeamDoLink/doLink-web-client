export type ConfirmDialogProps = {
  title: string;
  subtitle?: string;
  positiveLabel?: string;
  negativeLabel?: string;
  onPositive?: () => void;
  onNegative?: () => void;
};

export default function ConfirmDialog({
  title,
  subtitle,
  positiveLabel = 'Positive',
  negativeLabel = 'Negative',
  onPositive,
  onNegative,
}: ConfirmDialogProps) {
  return (
    <div className='flex w-96 flex-col gap-7 rounded-2xl bg-white px-5 py-6'>
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
          onClick={onPositive}
          className='flex h-11 w-full items-center justify-center rounded-lg bg-point font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-700'
        >
          {positiveLabel}
        </button>

        {/* Secondary Text Button */}
        <button
          onClick={onNegative}
          className='w-full text-center text-body-md text-grey-800 transition-colors hover:text-grey-900'
        >
          {negativeLabel}
        </button>
      </div>
    </div>
  );
}
