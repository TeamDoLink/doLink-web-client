import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addTypedMessageListener,
  isReactNativeWebView,
} from '@/utils/nativeBridge';
import { KeyboardAwareContext } from './keyboardAwareContext';

type KeyboardStatePayload = {
  visible: boolean;
  height: number;
  duration?: number;
};

/**
 * RN 앱의 `keyboard:state` 브리지를 구독해, 전역 `#root`에 키보드 높이만큼 padding-bottom을 줍니다.
 * 브라우저 단독 실행 시에는 리스너를 붙이지 않고 inset은 0입니다.
 */
export default function KeyboardAwareProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [keyboardInsetBottom, setKeyboardInsetBottom] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!isReactNativeWebView()) return;

    return addTypedMessageListener<KeyboardStatePayload>(
      'keyboard:state',
      (payload) => {
        console.log('payload', payload);
        const visible = Boolean(payload?.visible);
        const height = Number(payload?.height) || 0;
        const rawDuration = payload?.duration;
        const ms =
          typeof rawDuration === 'number' && rawDuration >= 0
            ? rawDuration
            : 250;

        setIsKeyboardVisible(visible);
        setKeyboardInsetBottom(visible ? Math.max(0, height) : 0);
      }
    );
  }, []);

  const value = useMemo(
    () => ({ keyboardInsetBottom, isKeyboardVisible }),
    [keyboardInsetBottom, isKeyboardVisible]
  );

  return (
    <KeyboardAwareContext.Provider value={value}>
      {children}
    </KeyboardAwareContext.Provider>
  );
}
