import { createContext, useContext } from 'react';

export interface KeyboardAwareValue {
  /** RN WebView에서 전달된 키보드 높이(px). 닫힌 상태면 0 */
  keyboardInsetBottom: number;
  /** 키보드가 열려 있는지 (native `keyboard:state` 기준) */
  isKeyboardVisible: boolean;
}

const defaultValue: KeyboardAwareValue = {
  keyboardInsetBottom: 0,
  isKeyboardVisible: false,
};

export const KeyboardAwareContext =
  createContext<KeyboardAwareValue>(defaultValue);

export const useKeyboardAware = (): KeyboardAwareValue =>
  useContext(KeyboardAwareContext);
