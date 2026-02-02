import type { ReactNativeWebView } from '@/types/draft';

/**
 * Platform 감지 (iOS vs Android)
 */
export const detectPlatform = (): 'ios' | 'android' => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS =
    /ipad|iphone|ipod/.test(userAgent) ||
    (/macintosh/.test(userAgent) && 'ontouchend' in document);
  return isIOS ? 'ios' : 'android';
};

/**
 * WebView 객체 가져오기
 */
export const getWebView = (): ReactNativeWebView | null => {
  return (
    (window as Window & { ReactNativeWebView?: ReactNativeWebView })
      .ReactNativeWebView ?? null
  );
};
