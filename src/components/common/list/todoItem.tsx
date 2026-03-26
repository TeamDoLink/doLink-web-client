import { CheckBox } from './checkBox';

export type TodoItemProps = {
  title: string;
  subtitle?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: () => void;
  width?: string;
};

export default function TodoItem({
  title,
  subtitle,
  checked = false,
  onChange,
  onClick,
  width = 'w-full',
}: TodoItemProps) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(!checked);
  };

  const handleCardClick = () => {
    onClick?.();
  };

  return (
    <div
      data-testid='task-item'
      role='button'
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`flex ${width} cursor-pointer items-start gap-3 px-5 py-0`}
    >
      {/* Content */}
      <div className='flex min-w-0 flex-1 flex-col items-start gap-0'>
        <div className='flex w-full items-center gap-1 overflow-hidden px-0 py-0.5'>
          <p className='truncate text-body-lg font-semibold text-black'>
            {title}
          </p>
        </div>

        {subtitle && (
          <div className='flex items-center gap-1 text-caption-sm font-medium text-grey-500'>
            <p className='shrink-0'>{subtitle}</p>
          </div>
        )}
      </div>

      {/* Checkbox */}
      <button
        type='button'
        role='checkbox'
        aria-checked={checked}
        aria-label={`${title} 완료 여부`}
        data-testid='task-checkbox'
        onClick={handleToggle}
        className='flex-shrink-0'
      >
        <CheckBox checked={checked} />
      </button>
    </div>
  );
}
