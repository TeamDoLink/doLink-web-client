import { useState, useCallback, useRef, useEffect } from 'react';

interface UseToastReturn {
  isVisible: boolean;
  message: string;
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

/**
 * 토스트 메시지를 관리하는 커스텀 훅
 * 자동으로 일정 시간 후 토스트를 숨김
 */
export function useToast(defaultDuration = 3000): UseToastReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const timerRef = useRef<number | null>(null);

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  const showToast = useCallback(
    (msg: string, duration = defaultDuration) => {
      // 기존 타이머가 있으면 클리어
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setMessage(msg);
      setIsVisible(true);

      // 자동 숨김 타이머 설정
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        timerRef.current = null;
      }, duration);
    },
    [defaultDuration]
  );

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isVisible,
    message,
    showToast,
    hideToast,
  };
}
