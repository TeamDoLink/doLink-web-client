import type { ReactNode } from 'react';

type ModalLayoutProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function ModalLayout({
  open,
  onClose,
  children,
}: ModalLayoutProps) {
  if (!open) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 배경(검은색 오버레이) 클릭 시만 닫힘
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
      onClick={handleBackgroundClick}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
