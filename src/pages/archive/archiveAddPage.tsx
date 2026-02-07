import { useNavigate } from 'react-router-dom';
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
          navigate(ROUTES.archives);
        },
      }
    );
  };

  return <ArchiveBottomSheet onSubmit={handleSubmit} />;
};

export default ArchiveAddPage;
