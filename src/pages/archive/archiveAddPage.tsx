import { ArchiveBottomSheet } from '@/components/archive';
import type { ArchiveCategoryKey } from '@/components/archive';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const ArchiveAddPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (payload: {
    name: string;
    category: ArchiveCategoryKey;
  }) => {
    // TODO: API 연동

    console.log('모음 생성 요청:', payload);

    // TODO: 성공 시 Toast 메시지
    // toast.success(`"${payload.name}" 모음이 생성되었습니다.`);

    navigate(ROUTES.archives);
  };

  return <ArchiveBottomSheet onSubmit={handleSubmit} />;
};

export default ArchiveAddPage;
