export type ItemChipsProps = {
  type?: 'solid' | 'line';
  isSelected?: boolean;
  label: string;
  onClick?: () => void;
};

export default function ItemChips({
  type = 'solid',
  isSelected = false,
  label,
  onClick,
}: ItemChipsProps) {
  const getStyleClass = () => {
    if (type === 'solid') {
      return isSelected
        ? 'bg-point text-white font-semibold'
        : 'bg-[#dcdde6] text-black';
    }

    // type === 'line'
    return isSelected
      ? 'border border-point bg-white text-point font-semibold'
      : 'border border-[#b9c0ff] bg-[#e9ebff] text-point';
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-[20px] px-3 py-2 text-caption-md ${getStyleClass()}`}
    >
      {label}
    </button>
  );
}
