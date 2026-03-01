export type ToastProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
};

// TODO 변경 가능성 있음(UI/UX)
export default function Toast({
  message,
  actionLabel = '로그인',
  onAction,
  onClose,
}: ToastProps) {
  const handleActionClick = () => {
    onAction?.();
    onClose?.();
  };

  return (
    <div className='flex w-[335px] items-center justify-between rounded-full bg-black/70 px-5 py-2 shadow-lg backdrop-blur-sm'>
      {/* Message Text */}
      <p className='text-body-xs text-white'>{message}</p>

      {/* Action Button */}
      <button
        onClick={handleActionClick}
        className='flex items-center justify-center py-[11px] pl-3 pr-0 text-body-xs font-bold text-[#828eff] transition-colors hover:text-[#a3b2ff]'
      >
        {actionLabel}
      </button>
    </div>
  );
}
