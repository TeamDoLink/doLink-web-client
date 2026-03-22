import { useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import closeIcon from '@/assets/icons/common/close-36.svg';
import { Button } from '@/components/common';
import { ArchiveInput } from './archiveInput';
import { ArchiveSelect, type ArchiveCategory } from './archiveSelect';
import KeyboardAware from '../common/KeyboardAware';

type ArchiveBottomSheetMode = 'create' | 'edit';

const MODE_PRESET: Record<
  ArchiveBottomSheetMode,
  { title: string; submit: string }
> = {
  create: {
    title: '모음 추가',
    submit: '추가하기',
  },
  edit: {
    title: '모음 수정',
    submit: '수정하기',
  },
};

interface ArchiveBottomSheetProps {
  mode?: ArchiveBottomSheetMode;
  initialName?: string;
  initialCategory?: ArchiveCategory | null;
  onSubmit?: (payload: { name: string; category: ArchiveCategory }) => void;
  onClose?: () => void;
}

const MAX_NAME_LENGTH = 20;

export const ArchiveBottomSheet = ({
  mode = 'create',
  initialName = '',
  initialCategory = null,
  onSubmit,
  onClose,
}: ArchiveBottomSheetProps) => {
  const navigate = useNavigate();
  const preset = MODE_PRESET[mode];
  const overlayRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(initialName);
  const [selectedCategory, setSelectedCategory] =
    useState<ArchiveCategory | null>(initialCategory);

  const trimmedName = name.trim();
  const isSubmittable = trimmedName.length > 0 && selectedCategory !== null;

  const handleConfirm = () => {
    if (!isSubmittable || selectedCategory === null) return;
    onSubmit?.({ name: trimmedName, category: selectedCategory });
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate(-1);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      handleClose();
      return;
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setName(nextValue.slice(0, MAX_NAME_LENGTH));
  };

  return (
    <div
      data-testid='bottom-sheet'
      className='flex h-full flex-col items-end justify-end bg-black/60'
      onClick={handleOverlayClick}
      ref={overlayRef}
    >
      <KeyboardAware className='relative flex w-full flex-col rounded-t-[32px] bg-white px-6 pb-6'>
        {/* header */}
        <div className='flex h-[76px] items-center justify-between'>
          <h1 className='text-heading-xl font-semibold text-black'>
            {preset.title}
          </h1>
          <button
            type='button'
            aria-label='닫기'
            onClick={handleClose}
            className='flex h-9 w-9 items-center justify-center'
            style={{ color: '#212121' }}
          >
            <img src={closeIcon} alt='' className='h-9 w-9' />
          </button>
        </div>

        {/* content */}
        <div className='flex flex-1 flex-col gap-8 overflow-y-auto'>
          <ArchiveInput
            id='archive-name'
            label='모음 이름'
            value={name}
            onChange={handleNameChange}
            placeholder='모음명을 입력해주세요.'
            maxLength={MAX_NAME_LENGTH}
          />

          <ArchiveSelect
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <Button.CtaButton
          type='button'
          disabled={!isSubmittable}
          className='mt-8 w-full'
          onClick={handleConfirm}
        >
          {preset.submit}
        </Button.CtaButton>
      </KeyboardAware>
    </div>
  );
};
