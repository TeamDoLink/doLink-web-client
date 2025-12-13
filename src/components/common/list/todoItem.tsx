import { CheckBox } from './checkBox';

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
        <CheckBox checked={checked} />
      </div>
    </button>
  );
}
