import { useNavigate } from 'react-router-dom';
import {
  ArchiveBottomSheet,
  type ArchiveSelectCategory,
} from '@/components/archive';
import { ROUTES } from '@/constants/routes';
import { useArchiveUIStore } from '@/stores/useArchiveUIStore';
import { useArchiveDataStore } from '@/stores/useArchiveDataStore';

const ArchiveAddPage = () => {
  const navigate = useNavigate();
  const setSelectedArchiveId = useArchiveUIStore(
    (state) => state.setSelectedArchiveId
  );
  // 로그인 후 모음 생성 API 호출
  const addArchive = useArchiveDataStore((state) => state.addArchive);

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveSelectCategory;
  }) => {
    addArchive({
      title: payload.name,
      category: payload.category,
      itemCount: 0,
      images: [],
    });
    setSelectedArchiveId(null);
    navigate(ROUTES.archives);
  };

  return <ArchiveBottomSheet onSubmit={handleSubmit} />;
};

export default ArchiveAddPage;
