import { useLocation, useNavigate } from 'react-router-dom';

import { ArchiveBottomSheet } from '@/components/archive';
import type { ArchiveCategoryKey } from '@/components/archive';
import { ROUTES } from '@/constants/routes';

type ArchiveEditLocationState = {
  archive?: {
    name: string;
    category: ArchiveCategoryKey;
  };
};

const ArchiveEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { archive } =
    (location.state as ArchiveEditLocationState | undefined) ?? {};

  // 임시 테스트용 데이터
  const testArchive = archive ?? {
    name: '도쿄 여행 계획',
    category: 'travel' as ArchiveCategoryKey,
  };

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveCategoryKey;
  }) => {
    console.log('모음 수정 요청:', payload);
    navigate(ROUTES.archives);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <ArchiveBottomSheet
      mode='edit'
      initialName={testArchive.name}
      initialCategory={testArchive.category}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
};

export default ArchiveEditPage;
