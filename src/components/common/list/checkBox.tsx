type CheckBoxProps = {
  checked?: boolean;
};

export function CheckBox({ checked = false }: CheckBoxProps) {
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
