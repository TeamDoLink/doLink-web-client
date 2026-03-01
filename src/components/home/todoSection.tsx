import { List } from '@/components/common';
import type { TodoItem } from '@/types';
import { formatRelativeDateLabel } from '@/utils/date';

type TodoSectionProps = {
  className?: string;
  items: TodoItem[];
  isTutorials?: boolean[];
  onToggle: (id: string, checked: boolean) => void;
  onTaskClick?: (id: string) => void;
  onDisabledClick?: (id: string) => void;
};

/**
 * 홈 화면 하단 할 일 목록 섹션
 */
export const TodoSection = ({
  className = '',
  items,
  isTutorials = [],
  onToggle,
  onTaskClick,
  onDisabledClick,
}: TodoSectionProps) => {
  return (
    <section className={`mt-5 space-y-4 ${className}`}>
      <h2 className='text-heading-sm text-black'>할 일</h2>
      <div className='space-y-4 rounded-2xl bg-white py-5 shadow-[0_12px_24px_rgba(18,30,64,0.08)]'>
        {items.map(({ id, title, platform, checked, createdAt }, index) => (
          <List.TodoItem
            key={id}
            title={title}
            subtitle={`${formatRelativeDateLabel(createdAt)} · ${platform}`}
            checked={checked}
            disabled={isTutorials[index]}
            onChange={(next) => onToggle(id, next)}
            onClick={() => onTaskClick?.(id)}
            onDisabledClick={() => onDisabledClick?.(id)}
          />
        ))}
      </div>
    </section>
  );
};
