import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ArchiveBottomSheet,
  type ArchiveSelectCategory,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';
import {
  useArchiveDataStore,
  type ArchiveRecord,
} from '@/stores/useArchiveDataStore';

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
  // 로그인 유무 확인 후 모음 상세 API 호출
  const archives = useArchiveDataStore((state) => state.archives);
  // 로그인 후 모음 수정 API 호출
  const updateArchive = useArchiveDataStore((state) => state.updateArchive);
  const selectedArchiveId = useArchiveUIStore(
    (state) => state.selectedArchiveId
  );
  const setSelectedArchiveId = useArchiveUIStore(
    (state) => state.setSelectedArchiveId
  );
  const { archive, origin } =
    (location.state as ArchiveEditLocationState | undefined) ?? {};

  const targetArchive = useMemo<ArchiveRecord | undefined>(() => {
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
    updateArchive(targetArchive.id, {
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
