export type CategoryEditorChipProps = {
  isSelected?: boolean;
  label: string;
  unselectedIcon: string;
  selectedIcon: string;
  onClick?: () => void;
};

export default function CategoryEditorChip({
  isSelected = false,
  label,
  unselectedIcon,
  selectedIcon,
  onClick,
}: CategoryEditorChipProps) {
  return (
    <button
      onClick={onClick}
      className='flex cursor-pointer flex-col items-center gap-1 border-none bg-transparent p-0'
    >
      <div className='relative h-10 w-10 overflow-hidden rounded-[16px]'>
        <img
          src={isSelected ? selectedIcon : unselectedIcon}
          alt={label}
          className='h-full w-full object-contain'
        />
      </div>
      <p
        className={`w-16 text-center text-body-sm ${
          isSelected ? 'font-semibold text-point' : 'font-medium text-grey-800'
        }`}
      >
        {label}
      </p>
    </button>
  );
}
