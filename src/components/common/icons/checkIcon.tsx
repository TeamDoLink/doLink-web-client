import type { SVGProps } from 'react';

/**
 * 체크 아이콘 컴포넌트
 */
export const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M10.35 3.29688L5.56509 8.69687L2.25 5.83253'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
