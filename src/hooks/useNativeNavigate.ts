import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectPlatform } from '@/utils/webview';
import { isReactNativeWebView, sendMessageToRN } from '@/utils/nativeBridge';

type NativeToWebMessage =
  | {
      type: 'navigate:deeplink';
      payload?: {
        path?: unknown;
      };
    }
  | {
      type: 'navigate:back';
    };

function normalizeNavigatePath(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // full URL이 들어오는 케이스까지 방어
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const out = `${url.pathname}${url.search}${url.hash}`;
      return out.startsWith('/') ? out : `/${out}`;
    } catch {
      // fallthrough
    }
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function safeParseMessage(data: unknown): unknown {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
}

function isNativeToWebMessage(message: unknown): message is NativeToWebMessage {
  if (!message || typeof message !== 'object') return false;
  const maybe = message as { type?: unknown };
  return maybe.type === 'navigate:deeplink' || maybe.type === 'navigate:back';
}

function canGoBackInBrowserHistory(): boolean {
  const state = window.history.state as unknown;
  const idx = (state as { idx?: unknown } | null)?.idx;
  if (typeof idx === 'number') return idx > 0;
  return window.history.length > 1;
}

/**
 * RN WebView → Web 메시지(navigate:deeplink / navigate:back)를 수신해 react-router navigate로 라우팅합니다.
 * iOS(window) / Android(document) 모두 지원합니다.
 */
export function useNativeNavigate(): void {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const platform = detectPlatform();
    const receiver: EventTarget = platform === 'ios' ? window : document;

    const handleMessage = (event: Event): void => {
      if (!(event instanceof MessageEvent)) return;

      // 일반 브라우저에서는 외부 origin 메시지 무시 (RN WebView는 origin이 없는 경우가 많아 예외 처리)
      if (!isReactNativeWebView()) {
        const origin = (event as MessageEvent).origin;
        if (origin && origin !== window.location.origin) return;
      }

      const parsed = safeParseMessage((event as MessageEvent<unknown>).data);
      if (!isNativeToWebMessage(parsed)) return;

      if (parsed.type === 'navigate:deeplink') {
        const rawPath = parsed.payload?.path;
        if (typeof rawPath !== 'string') return;

        const path = normalizeNavigatePath(rawPath);
        if (!path || path === '/') return;

        navigate(path);
        return;
      }

      if (parsed.type === 'navigate:back') {
        if (canGoBackInBrowserHistory()) {
          navigate(-1);
          return;
        }

        sendMessageToRN({ type: 'navigate:back:exit' });
      }
    };

    receiver.addEventListener('message', handleMessage);
    return () => receiver.removeEventListener('message', handleMessage);
  }, [navigate]);
}
