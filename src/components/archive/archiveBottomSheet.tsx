import { useEffect, useMemo, useState, type FormEvent } from 'react';

import closeIcon from '@/assets/icons/common/close-36.svg';
import { Archive, Button } from '@/components/common';
import type { ArchiveCategoryKey } from '@/components/common/archive';

interface ArchiveBottomSheetProps {
  title?: string;
  submitLabel?: string;
  initialName?: string;
  initialCategory?: ArchiveCategoryKey | null;
  onSubmit?: (payload: { name: string; category: ArchiveCategoryKey }) => void;
  onClose?: () => void;
}

const MAX_NAME_LENGTH = 20;

export const ArchiveBottomSheet = ({
  title = '모음 추가',
  submitLabel = '추가하기',
  initialName = '',
  initialCategory = null,
  onSubmit,
  onClose,
}: ArchiveBottomSheetProps) => {
  const [name, setName] = useState(initialName);
  const [selectedCategory, setSelectedCategory] =
    useState<ArchiveCategoryKey | null>(initialCategory);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const isSubmittable = useMemo(
    () => name.trim().length > 0 && selectedCategory !== null,
    [name, selectedCategory]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable || selectedCategory === null) return;

    onSubmit?.({ name: name.trim(), category: selectedCategory });
  };

  return (
    <div className='flex min-h-screen w-full items-end bg-black/60'>
      <form
        onSubmit={handleSubmit}
        className='w-full rounded-t-[32px] bg-white px-6 pb-10'
        style={{ paddingBottom: 'calc(40px + env(safe-area-inset-bottom))' }}
      >
        <div className='flex h-[76px] items-center justify-between'>
          <h1 className='text-heading-xl font-semibold text-black'>{title}</h1>
          <button
            type='button'
            aria-label='닫기'
            onClick={onClose}
            className='flex h-9 w-9 items-center justify-center'
            style={{ color: '#212121' }}
          >
            <img src={closeIcon} alt='' className='h-9 w-9' />
          </button>
        </div>

        <div className='flex flex-col gap-8'>
          <Archive.ArchiveInput
            label='모음 이름'
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='모음명을 입력해주세요.'
            maxLength={MAX_NAME_LENGTH}
          />

          <Archive.ArchiveSelect
            selected={selectedCategory ?? undefined}
            onSelect={setSelectedCategory}
          />
        </div>

        <Button.CtaButton
          type='submit'
          disabled={!isSubmittable}
          className='mt-8'
        >
          {submitLabel}
        </Button.CtaButton>
      </form>
    </div>
  );
};
