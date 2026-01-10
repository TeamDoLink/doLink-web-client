import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ArchiveBottomSheet,
  type ArchiveSelectCategoryKey as ArchiveCategoryKey,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import {
  useArchiveMockStore,
  type MockArchive,
} from '@/stores/useArchiveMockStore';

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
  const archives = useArchiveMockStore((state) => state.archives);
  const updateArchive = useArchiveMockStore((state) => state.updateArchive);
  const { archive, origin } =
    (location.state as ArchiveEditLocationState | undefined) ?? {};

  const targetArchive = useMemo<MockArchive | undefined>(() => {
    if (!archive) {
      return undefined;
    }
    return archives.find((item) => item.id === archive.id);
  }, [archive, archives]);

  const hasArchive = Boolean(targetArchive);

  useEffect(() => {
    if (!hasArchive) {
      navigate(ROUTES.archives, { replace: true });
    }
  }, [hasArchive, navigate]);

  if (!targetArchive) {
    return null;
  }

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveCategoryKey;
  }) => {
    updateArchive(targetArchive.id, {
      title: payload.name,
      category: payload.category,
    });
    const fallbackPath = origin ?? ROUTES.archives;
    navigate(fallbackPath, { replace: true });
  };

  return (
    <ArchiveBottomSheet
      mode='edit'
      initialName={targetArchive.title}
      initialCategory={targetArchive.category}
      onSubmit={handleSubmit}
    />
  );
};

export default ArchiveEditPage;
