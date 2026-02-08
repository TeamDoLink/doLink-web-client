import { useSearchParams } from 'react-router-dom';
import ExternalLink, {
  type ShareIntentData,
} from '@/components/link/externalLink';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';
import { sendMessageToRN } from '@/utils/nativeBridge';

/**
 * ExternalLinkPage
 * React Native WebView에서 할 일 담기 기능을 수행하기 위한 전용 페이지
 */
export default function ExternalLinkPage() {
  const [searchParams] = useSearchParams();
  const isVisible = true;

  // URL 파라미터로부터 초기 데이터 파싱 (필요 시)
  const shareValue = searchParams.get('value');
  const shareType = searchParams.get('type') as 'text' | 'weburl' | null;

  const shareIntent: ShareIntentData | null =
    shareValue && shareType
      ? {
          value: shareValue,
          type: shareType,
        }
      : null;

  const { isAuthenticated, isAuthInitialized } = useAuthStore();

  useEffect(() => {
    if (isAuthInitialized) {
      sendMessageToRN({
        type: 'auth:status',
        payload: { isAuthenticated },
      });
    }
  }, [isAuthenticated, isAuthInitialized]);

  /**
   * React Native로 메시지 전송
   */
  const postMessageToNative = (data: {
    type: string;
    [key: string]: unknown;
  }) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } else {
      console.log('PostMessage to Native:', data);
    }
  };

  const handleClose = () => {
    postMessageToNative({ type: 'CLOSE' });
  };

  const handleSelect = (id: string) => {
    postMessageToNative({ type: 'SELECT_COLLECTION', id });
  };

  return (
    <div className='h-screen w-screen bg-white'>
      <ExternalLink
        visible={isVisible}
        onClose={handleClose}
        onSelect={handleSelect}
        shareIntent={shareIntent}
      />
    </div>
  );
}

// 명시적인 타입 확장을 위해 전역 인터페이스 선언
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
