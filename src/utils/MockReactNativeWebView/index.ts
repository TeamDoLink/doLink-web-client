/**
 * 개발 환경에서 ReactNativeWebView가 없을 때 사용하는 Mock 구현체
 *
 * 역할:
 *  - postMessage 호출을 콘솔에 출력
 *  - 각 브릿지 메시지 타입에 맞는 응답 이벤트를 자동으로 dispatch
 *  - auth:reissue 는 실제 웹 API(/v1/auth/reissue)를 호출하여 토큰을 응답
 */

import { reissue } from './api';
import { detectPlatform } from '../webview';
import { AVAILABLE_WEB_MOCK_BRIDGE } from '@/constants/native';

interface MockConfig {
  /** auth:login 응답 시 사용할 가짜 accessToken */
  mockAccessToken?: string;
  /** link:canOpen 응답 시 사용할 기본값 */
  defaultCanOpen?: boolean;
  /** 응답 지연 시간 (ms) */
  responseDelay?: number;
}

const DEFAULT_CONFIG: Required<MockConfig> = {
  mockAccessToken: 'mock-access-token-for-dev',
  defaultCanOpen: true,
  responseDelay: 300,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getDraftPayload = (
  payload: unknown
): { key: string; data?: unknown } | null => {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const draftPayload = payload as { key?: unknown; data?: unknown };
  if (typeof draftPayload.key !== 'string' || draftPayload.key.length === 0) {
    return null;
  }

  return {
    key: draftPayload.key,
    data: draftPayload.data,
  };
};

// nativeBridge.ts 의 platformBrowser 와 동일한 기준 사용
const platformBrowser: EventTarget =
  detectPlatform() === 'ios' ? window : document;

/**
 * 브릿지 응답 메시지를 window/document 의 message 이벤트로 dispatch
 */
function dispatchBridgeResponse(
  data: object,
  target: EventTarget = platformBrowser
) {
  const event = new MessageEvent('message', {
    data: JSON.stringify(data),
    origin: window.location.origin,
  });
  target.dispatchEvent(event);
}

class MockReactNativeWebView {
  private config: Required<MockConfig>;

  constructor(config: MockConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    console.info(
      '[MockReactNativeWebView] 초기화됨 (개발 환경 전용)',
      this.config
    );
  }

  postMessage(message: string): void {
    let parsed: { type: string; payload?: unknown };

    try {
      parsed = JSON.parse(message);
    } catch {
      console.warn('[MockReactNativeWebView] postMessage 파싱 실패:', message);
      return;
    }

    console.log('[MockReactNativeWebView] postMessage 수신:', parsed);

    const { type, payload } = parsed;
    const { defaultCanOpen, responseDelay } = this.config;

    switch (type) {
      case 'auth:login':
        (async () => {
          try {
            await sleep(responseDelay);
            const { result } = await reissue();
            console.log(
              '[MockReactNativeWebView] auth:login → auth:token 응답 전송 (mock)',
              result
            );
            dispatchBridgeResponse({
              type: 'auth:token',
              payload: { accessToken: result },
            });
          } catch (error: unknown) {
            console.error('[MockReactNativeWebView] auth:login 실패:', error);
            if (error instanceof Error) {
              dispatchBridgeResponse({
                type: 'auth:error',
                payload: {
                  message: error.message,
                },
              });
            }
          }
        })();
        break;

      case 'auth:reissue':
        (async () => {
          console.log(
            '[MockReactNativeWebView] auth:reissue → 실제 웹 API 호출 (orval)'
          );
          try {
            const { result } = await reissue();
            console.log(
              '[MockReactNativeWebView] auth:reissue → auth:token 응답 전송 (실제 토큰)'
            );
            dispatchBridgeResponse({
              type: 'auth:token',
              payload: { accessToken: result },
            });
          } catch (error: unknown) {
            if (error instanceof Error) {
              dispatchBridgeResponse({
                type: 'auth:error',
                payload: {
                  message: error.message,
                },
              });
            }
          }
        })();
        break;

      case 'auth:logout':
        console.log('[MockReactNativeWebView] auth:logout 수신 (응답 없음)');
        break;

      case 'link:open':
        console.log(
          '[MockReactNativeWebView] link:open 수신 (fire-and-forget):',
          payload
        );
        break;

      case 'link:canOpen': {
        const url = (payload as { url?: string })?.url ?? '';
        (async () => {
          await sleep(responseDelay);
          console.log(
            '[MockReactNativeWebView] link:canOpen → link:response 응답 전송'
          );
          dispatchBridgeResponse({
            type: 'link:response',
            url,
            canOpen: defaultCanOpen,
          });
        })();
        break;
      }

      case 'os:share':
        console.log(
          '[MockReactNativeWebView] os:share 수신 (응답 없음):',
          payload
        );
        break;

      case 'SAVE_DRAFT': {
        const draftPayload = getDraftPayload(payload);

        (async () => {
          await sleep(responseDelay);

          if (!draftPayload) {
            dispatchBridgeResponse({
              type: 'SAVE_DRAFT',
              success: false,
              error: 'Invalid draft payload',
            });
            return;
          }

          try {
            window.localStorage.setItem(
              draftPayload.key,
              JSON.stringify(draftPayload.data ?? null)
            );
            dispatchBridgeResponse({
              type: 'SAVE_DRAFT',
              success: true,
            });
          } catch (error: unknown) {
            dispatchBridgeResponse({
              type: 'SAVE_DRAFT',
              success: false,
              error:
                error instanceof Error ? error.message : 'Failed to save draft',
            });
          }
        })();
        break;
      }

      case 'LOAD_DRAFT': {
        const draftPayload = getDraftPayload(payload);

        (async () => {
          await sleep(responseDelay);

          if (!draftPayload) {
            dispatchBridgeResponse({
              type: 'LOAD_DRAFT',
              success: false,
              error: 'Invalid draft payload',
            });
            return;
          }

          try {
            const rawDraft = window.localStorage.getItem(draftPayload.key);
            dispatchBridgeResponse({
              type: 'LOAD_DRAFT',
              success: true,
              data: rawDraft ? JSON.parse(rawDraft) : null,
            });
          } catch (error: unknown) {
            dispatchBridgeResponse({
              type: 'LOAD_DRAFT',
              success: false,
              error:
                error instanceof Error ? error.message : 'Failed to load draft',
            });
          }
        })();
        break;
      }

      case 'DELETE_DRAFT': {
        const draftPayload = getDraftPayload(payload);

        (async () => {
          await sleep(responseDelay);

          if (!draftPayload) {
            dispatchBridgeResponse({
              type: 'DELETE_DRAFT',
              success: false,
              error: 'Invalid draft payload',
            });
            return;
          }

          try {
            window.localStorage.removeItem(draftPayload.key);
            dispatchBridgeResponse({
              type: 'DELETE_DRAFT',
              success: true,
            });
          } catch (error: unknown) {
            dispatchBridgeResponse({
              type: 'DELETE_DRAFT',
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to delete draft',
            });
          }
        })();
        break;
      }

      default:
        console.warn(
          '[MockReactNativeWebView] 알 수 없는 메시지 타입:',
          type,
          payload
        );
    }
  }
}

/**
 * 개발 환경에서 window.ReactNativeWebView 가 없으면 Mock으로 초기화
 *
 * nativeBridge.ts 보다 먼저 import 되어야 합니다.
 *
 * @example
 * // main.tsx 또는 앱 진입점에서 가장 먼저 import
 * import '@/utils/mock-react-native-web-view';
 */
export function initMockReactNativeWebView(config?: MockConfig): void {
  if (!AVAILABLE_WEB_MOCK_BRIDGE) return;
  if (window.ReactNativeWebView) return;

  window.ReactNativeWebView = new MockReactNativeWebView(config);
  console.info(
    '[MockReactNativeWebView] window.ReactNativeWebView 에 Mock 할당 완료'
  );
}
