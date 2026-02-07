import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import {
  ArchiveBottomSheet,
  type ArchiveSelectCategory,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import {
  useUpdateCollect,
  getListAll1QueryKey as getListAllQueryKey,
  getListByCategoryQueryKey,
} from '@/api/generated/endpoints/collection/collection';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';
import type { CollectionUpdateRequestCategory } from '@/api/generated/models';

type ArchiveEditLocationState = {
  origin?: string;
  archive?: {
    id: string;
    title: string;
    category: ArchiveSelectCategory;
  };
};

const ArchiveEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { mutate: updateCollect } = useUpdateCollect();

  const { archive, origin } =
    (location.state as ArchiveEditLocationState | undefined) ?? {};

  useEffect(() => {
    if (!archive) {
      navigate(ROUTES.archives, { replace: true });
    }
  }, [archive, navigate]);

  if (!archive) {
    return null;
  }

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveSelectCategory;
  }) => {
    updateCollect(
      {
        collectId: Number(archive.id),
        data: {
          name: payload.name,
          category: ARCHIVE_CATEGORY_LABEL[
            payload.category
          ] as CollectionUpdateRequestCategory,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAllQueryKey() });
          queryClient.invalidateQueries({
            queryKey: getListByCategoryQueryKey(),
          });
          const fallbackPath = origin ?? ROUTES.archives;
          navigate(fallbackPath, { replace: true });
        },
      }
    );
  };

  return (
    <ArchiveBottomSheet
      mode='edit'
      initialName={archive.title}
      initialCategory={archive.category}
      onSubmit={handleSubmit}
    />
  );
};

export default ArchiveEditPage;
