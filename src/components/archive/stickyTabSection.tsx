import { TabButton } from '@/components/common/button/tabButton';
import SortDropdown from '@/components/common/filter/sortDropdown';

interface TabOption {
  value: string;
  label: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface StickyTabSectionProps {
  // 탭 옵션 배열
  tabs: TabOption[];
  // 현재 선택된 탭
  selectedTab: string;
  // 탭 변경 핸들러
  onTabChange: (tab: string) => void;
  // 정렬 옵션 배열
  sortOptions: SortOption[];
  // 현재 정렬 옵션
  sortValue: string;
  // 정렬 변경 핸들러
  onSortChange: (value: string) => void;
}

/**
 * Sticky Tab Section 컴포넌트
 * - 탭 버튼들과 정렬 드롭다운을 포함
 * - 스크롤 시 BackDetailBar 아래에 고정되는 sticky 동작
 */
export const StickyTabSection = ({
  tabs,
  selectedTab,
  onTabChange,
  sortOptions,
  sortValue,
  onSortChange,
}: StickyTabSectionProps) => {
  return (
    <div className='sticky top-14 z-20 flex items-center justify-between border-b border-grey-200 bg-white px-5 pb-3 pt-1'>
      {/* 탭 버튼들 */}
      <div className='flex items-center gap-5'>
        {tabs.map((tab) => (
          <TabButton
            key={tab.value}
            selected={selectedTab === tab.value}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* 정렬 드롭다운 */}
      <SortDropdown
        value={sortValue}
        onChange={onSortChange}
        options={sortOptions}
      />
    </div>
  );
};
