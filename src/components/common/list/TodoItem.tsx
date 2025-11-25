const imgEllipseChecked =
  'https://www.figma.com/api/mcp/asset/e60083f2-1ce7-4e7a-a6e7-83e6a0180c10';
const imgCheckIcon =
  'https://www.figma.com/api/mcp/asset/cba82206-0083-4844-872d-cc39c33baeda';
const imgEllipseUnchecked =
  'https://www.figma.com/api/mcp/asset/b06053c9-4c78-46ba-a43a-501393664638';

type CheckboxComponentProps = {
  checked?: boolean;
};

// TODO 앱 위에서 test 필요
function CheckboxComponent({ checked = false }: CheckboxComponentProps) {
  if (checked) {
    return (
      <div className='relative size-6 overflow-clip'>
        <img
          alt='checked'
          className='block size-full'
          src={imgEllipseChecked}
        />
        <div className='absolute left-[6.48px] top-[8.4px] h-[7.2px] w-[10.8px]'>
          <img
            alt='check icon'
            className='block size-full'
            src={imgCheckIcon}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='relative size-6 overflow-clip'>
      <img
        alt='unchecked'
        className='block size-full'
        src={imgEllipseUnchecked}
      />
    </div>
  );
}

export type TodoItemProps = {
  title: string;
  subtitle?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function TodoItem({
  title,
  subtitle,
  checked = false,
  onChange,
}: TodoItemProps) {
  const handleToggle = () => {
    onChange?.(!checked);
  };

  return (
    <button
      onClick={handleToggle}
      className='flex w-[335px] items-start gap-3 px-5 py-0 transition-opacity hover:opacity-70 active:opacity-50'
    >
      {/* Content */}
      <div className='flex flex-1 flex-col items-start gap-0'>
        <div className='flex w-full items-center gap-1 px-0 py-0.5'>
          <p className='text-body-lg text-black'>{title}</p>
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
