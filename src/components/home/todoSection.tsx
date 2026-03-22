import { List } from '@/components/common';
import type { TodoItem } from '@/types';
import { formatRelativeDateLabel } from '@/utils/date';
import Card from '../card';

type TodoSectionProps = {
  className?: string;
  items: TodoItem[];
  onToggle: (id: string, checked: boolean) => void;
  onTaskClick?: (id: string) => void;
};

/**
 * 홈 화면 하단 할 일 목록 섹션
 */
export const TodoSection = ({
  className = '',
  items,
  onToggle,
  onTaskClick,
}: TodoSectionProps) => {
  return (
    <section className={`mb-5 ${className}`}>
      <h2 className='mb-2 py-2 text-heading-sm text-black'>할 일</h2>
      <Card className='space-y-4 rounded-2xl bg-white py-5'>
        {items.map(({ id, title, platform, checked, createdAt }) => (
          <List.TodoItem
            key={id}
            title={title}
            subtitle={`${formatRelativeDateLabel(createdAt)} · ${platform}`}
            checked={checked}
            onChange={(next) => onToggle(id, next)}
            onClick={() => onTaskClick?.(id)}
          />
        ))}
      </Card>
    </section>
  );
};
