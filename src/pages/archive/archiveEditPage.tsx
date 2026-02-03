import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ArchiveBottomSheet,
  type ArchiveSelectCategory,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import {
  archiveMockApi,
  useMockArchives,
  type Archive,
} from '@/api/archive.mock';
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';

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
  const archives = useMockArchives();
  const selectedArchiveId = useArchiveUIStore(
    (state) => state.selectedArchiveId
  );
  const setSelectedArchiveId = useArchiveUIStore(
    (state) => state.setSelectedArchiveId
  );
  const { archive, origin } =
    (location.state as ArchiveEditLocationState | undefined) ?? {};

  const targetArchive = useMemo<Archive | undefined>(() => {
    const targetId = archive?.id ?? selectedArchiveId;
    if (!targetId) {
      return undefined;
    }

    return archives.find((item) => item.id === targetId);
  }, [archive, archives, selectedArchiveId]);

  const hasArchive = Boolean(targetArchive);

  useEffect(() => {
    if (!hasArchive) {
      navigate(ROUTES.archives, { replace: true });
    }
  }, [hasArchive, navigate]);

  useEffect(() => {
    return () => setSelectedArchiveId(null);
  }, [setSelectedArchiveId]);

  if (!targetArchive) {
    return null;
  }

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveSelectCategory;
  }) => {
    archiveMockApi.update(targetArchive.id, {
      title: payload.name,
      category: payload.category,
    });
    setSelectedArchiveId(null);
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
