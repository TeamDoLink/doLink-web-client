import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import {
  ArchiveBottomSheet,
  type ArchiveSelectCategory,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import {
  useUpdateCollect,
  useGetCollectDetail,
  getListAll1QueryKey as getListAllQueryKey,
  getListByCategoryQueryKey,
  getGetCollectDetailQueryKey,
} from '@/api/generated/endpoints/collection/collection';
import { ARCHIVE_CATEGORY_LABEL } from '@/utils/archiveCategory';
import type {
  CollectionUpdateRequestCategory,
  ApiResponseCollectionDetailResponse,
} from '@/api/generated/models';

// 한글 카테고리 → 영문 키 역매핑
const CATEGORY_LABEL_TO_KEY = Object.fromEntries(
  Object.entries(ARCHIVE_CATEGORY_LABEL)
    .filter(([key]) => key !== 'all')
    .map(([key, label]) => [label, key])
) as Record<string, ArchiveSelectCategory>;

const ArchiveEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { mutate: updateCollect } = useUpdateCollect();

  const collectionId = id ? Number(id) : 0;

  // API에서 모음 정보 가져오기
  const { data: collectionData, isLoading } = useGetCollectDetail(
    collectionId,
    {
      query: { enabled: !!collectionId },
    }
  );

  const apiCollectionData =
    collectionData as unknown as ApiResponseCollectionDetailResponse;
  const apiTitle = apiCollectionData?.result?.name;
  const apiCategory = apiCollectionData?.result?.category;

  useEffect(() => {
    if (!collectionId) {
      navigate(ROUTES.archives, { replace: true });
    }
  }, [collectionId, navigate]);

  if (!collectionId || isLoading) {
    return null;
  }

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveSelectCategory;
  }) => {
    updateCollect(
      {
        collectId: collectionId,
        data: {
          name: payload.name,
          category: ARCHIVE_CATEGORY_LABEL[
            payload.category
          ] as CollectionUpdateRequestCategory,
        },
      },
      {
        onSuccess: () => {
          // 모든 쿼리 무효화
          queryClient.invalidateQueries({ queryKey: getListAllQueryKey() });
          queryClient.invalidateQueries({
            queryKey: getListByCategoryQueryKey(),
          });
          // 무한스크롤 쿼리 무효화
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) &&
              query.queryKey[0] === 'collections',
          });
          queryClient.invalidateQueries({
            queryKey: getGetCollectDetailQueryKey(collectionId),
          });
          navigate(-1);
        },
      }
    );
  };

  const categoryKey = CATEGORY_LABEL_TO_KEY[apiCategory ?? ''] ?? 'etc';

  return (
    <ArchiveBottomSheet
      mode='edit'
      initialName={apiTitle ?? ''}
      initialCategory={categoryKey}
      onSubmit={handleSubmit}
    />
  );
};

export default ArchiveEditPage;
