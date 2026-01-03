import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ArchiveBottomSheet,
  type ArchiveSelectCategoryKey as ArchiveCategoryKey,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import { MOCK_ARCHIVES } from '@/mocks/archiveData';
import {
  toEditorCategory,
  toFilterCategory,
  type ArchiveFilterCategory,
} from '@/utils/archiveCategory';

type ArchiveEditLocationState = {
  origin?: string;
  archive?: {
    id: string;
    title: string;
    category: ArchiveCategoryKey;
  };
};

const ArchiveEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { archive, origin } =
    (location.state as ArchiveEditLocationState | undefined) ?? {};

  const fallbackArchive = MOCK_ARCHIVES[0];
  const targetArchive:
    | {
        id: string;
        title: string;
        category: ArchiveFilterCategory;
      }
    | undefined = archive
    ? {
        id: archive.id,
        title: archive.title,
        category: toFilterCategory(archive.category),
      }
    : fallbackArchive;

  const hasArchive = Boolean(targetArchive);

  useEffect(() => {
    if (!hasArchive) {
      navigate(ROUTES.archives);
    }
  }, [hasArchive, navigate]);

  if (!targetArchive) {
    return null;
  }

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveCategoryKey;
  }) => {
    console.log('모음 수정 요청(Mock):', {
      ...payload,
      id: targetArchive.id,
    });
    const fallbackPath = origin ?? ROUTES.archives;
    navigate(fallbackPath, { replace: true });
  };

  return (
    <ArchiveBottomSheet
      mode='edit'
      initialName={targetArchive.title}
      initialCategory={toEditorCategory(targetArchive.category)}
      onSubmit={handleSubmit}
    />
  );
};

export default ArchiveEditPage;
