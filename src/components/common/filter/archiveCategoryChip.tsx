export type ArchiveCategoryChipProps = {
  isSelected?: boolean;
  label: string;
  unselectedIcon: string;
  selectedIcon: string;
  onClick?: () => void;
};

export default function ArchiveCategoryChip({
  isSelected = false,
  label,
  unselectedIcon,
  selectedIcon,
  onClick,
}: ArchiveCategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className='flex cursor-pointer flex-col items-center gap-2 border-none bg-transparent p-0'
    >
      <div
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-grey-50`}
      >
        <img
          src={isSelected ? selectedIcon : unselectedIcon}
          alt={label}
          className='h-full w-full object-contain'
        />
      </div>
      <p
        className={`w-14 text-center text-caption-md leading-[18px] ${
          isSelected
            ? 'font-semibold text-grey-900'
            : 'font-medium text-grey-500'
        }`}
      >
        {label}
      </p>
    </button>
  );
}
