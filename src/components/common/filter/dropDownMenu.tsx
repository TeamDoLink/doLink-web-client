// TODO : Figma 에셋 URL 교체 필요
import check from '@/assets/icons/common/drop-down-menu-check.svg';

export type DropDownMenuOption = {
  label: string;
  value: string;
};

export type DropDownMenuProps = {
  /** 옵션 목록 */
  options: DropDownMenuOption[];
  /** 선택된 값 */
  selectedValue?: string;
  /** 선택 시 호출 */
  onSelect?: (value: string) => void;
  /** 추가 클래스 */
  className?: string;
};

/**
 * DropDownMenu
 * 드롭다운 컨텍스트 메뉴
 * className으로 추가 스타일링 가능하게 함
 */
export default function DropDownMenu({
  options,
  selectedValue,
  onSelect,
  className = '',
}: DropDownMenuProps) {
  return (
    <div
      className={`relative flex flex-col items-start overflow-clip rounded-[8px] bg-white px-0 py-[0.5rem] shadow-[0px_3px_10px_0px_rgba(0,0,0,0.16)] ${className}`}
    >
      {options.map((opt) => {
        const selected = opt.value === selectedValue;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect?.(opt.value)}
            className={`relative flex shrink-0 items-center gap-[4px] bg-white px-[1.25rem] py-[0.5625rem] text-left ${
              selected
                ? 'text-caption-md text-grey-900'
                : 'text-caption-sm text-grey-700'
            } `}
          >
            <span>{opt.label}</span>

            {selected ? (
              <img
                src={check}
                alt='selected'
                className='relative ml-auto h-[12px] w-[12px] shrink-0'
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
