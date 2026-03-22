import { useKeyboardAware } from '@/components/providers/keyboardAwareContext';
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  type HTMLAttributes,
} from 'react';

/**
 * content의 높이가 webView의 높이 - keyboard의 높이 값을 초과하지 않도록 제한합니다
 * keyboard의 높이만큼 div를 translateY로 이동시킵니다
 * 높이값은 webview 높이 - keyboard 의 높이값을 뺸 값을 max-height로 제한합니다
 */
interface KeyboardAwareProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const KeyboardAware = ({ children, ...props }: KeyboardAwareProps) => {
  const { keyboardInsetBottom } = useKeyboardAware();

  const webviewHeight = useRef<number>(document.documentElement.clientHeight);
  const contentRef = useRef<HTMLDivElement>(null);

  const getMaxHeight = useCallback(() => {
    return webviewHeight.current - keyboardInsetBottom;
  }, [keyboardInsetBottom]);

  const style = useMemo(() => {
    return {
      ...(props.style ?? {}),
      maxHeight: `${getMaxHeight()}px`,
      transform: `translateY(${-keyboardInsetBottom}px)`,
    };
  }, [getMaxHeight, keyboardInsetBottom, props.style]);

  return (
    <div {...props} ref={contentRef} style={style}>
      {children}
    </div>
  );
};

export default KeyboardAware;
