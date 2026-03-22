import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArchiveBottomSheet,
  type ArchiveSelectCategory,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import { useCreateCollect } from '@/api/generated/endpoints/collection/collection';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';
import type { CollectionCreateRequestCategory } from '@/api/generated/models';

const ArchiveAddPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: createCollection } = useCreateCollect();

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveSelectCategory;
  }) => {
    createCollection(
      {
        data: {
          name: payload.name,
          category: ARCHIVE_CATEGORY_LABEL[
            payload.category
          ] as CollectionCreateRequestCategory,
        },
      },
      {
        onSuccess: () => {
          // 모음 목록 및 개수 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: ['collections'] });
          queryClient.invalidateQueries({
            queryKey: ['/api/v1/collect/count'],
          });
          queryClient.invalidateQueries({
            queryKey: ['/api/v1/collect/category-counts'],
          });
          navigate(ROUTES.archives);
        },
      }
    );
  };

  return (
    <div className='absolute inset-0 z-50'>
      <ArchiveBottomSheet onSubmit={handleSubmit} />
    </div>
  );
};

export default ArchiveAddPage;
