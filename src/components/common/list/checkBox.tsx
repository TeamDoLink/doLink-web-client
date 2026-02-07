import checkCircleSelected from '@/assets/icons/common/check-circle-selected.svg';
import checkCircleUnselected from '@/assets/icons/common/check-circle-unselected.svg';
import checkCircleDisabled from '@/assets/icons/common/check-circle-disabled.svg';

type CheckBoxProps = {
  checked?: boolean;
  disabled?: boolean;
};

export function CheckBox({ checked = false, disabled = false }: CheckBoxProps) {
  const iconSrc = disabled
    ? checkCircleDisabled
    : checked
      ? checkCircleSelected
      : checkCircleUnselected;

  return (
    <span className='flex h-6 w-6 flex-shrink-0 items-center justify-center'>
      <img src={iconSrc} className='h-6 w-6' />
    </span>
  );
}
