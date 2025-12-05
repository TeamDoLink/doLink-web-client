type CheckboxComponentProps = {
  checked?: boolean;
};

function CheckboxComponent({ checked = false }: CheckboxComponentProps) {
  if (checked) {
    return (
      <div className='flex h-[1.5rem] w-[1.5rem] flex-shrink-0 items-center justify-center rounded-full bg-point'>
        {/* Check Mark */}
        <svg
          className='h-[0.875rem] w-[0.875rem] text-white'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='20 6 9 17 4 12'></polyline>
        </svg>
      </div>
    );
  }

  return (
    <div className='h-[1.5rem] w-[1.5rem] flex-shrink-0 rounded-full border-2 border-grey-300 bg-white'></div>
  );
}

export type TodoItemProps = {
  title: string;
  subtitle?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  width?: string;
};

export default function TodoItem({
  title,
  subtitle,
  checked = false,
  onChange,
  width = 'w-full',
}: TodoItemProps) {
  const handleToggle = () => {
    onChange?.(!checked);
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex ${width} items-start gap-3 px-5 py-0`}
    >
      {/* Content */}
      <div className='flex min-w-0 flex-1 flex-col items-start gap-0'>
        <div className='flex w-full items-center gap-1 overflow-hidden px-0 py-0.5'>
          <p className='truncate text-body-lg text-black'>{title}</p>
        </div>

        {subtitle && (
          <div className='flex items-center gap-1 text-caption-sm text-grey-500'>
            <p className='shrink-0'>{subtitle}</p>
          </div>
        )}
      </div>

      {/* Checkbox */}
      <div className='flex-shrink-0'>
        <CheckboxComponent checked={checked} />
      </div>
    </button>
  );
}
