import { test as base, expect, type Page } from '@playwright/test';
import { GUEST_BRIDGE_SCRIPT } from '../helpers/bridge';

/**
 * 인증 흐름:
 *
 * [authPage]
 *   - 앱의 기존 MockReactNativeWebView(main.tsx)가 그대로 동작합니다.
 *   - auth:login 수신 → reissue() 호출 → api.ts에서 VITE_E2E_ACCESS_TOKEN 반환
 *   - → Zustand isAuthenticated = true, 실제 API 호출 가능
 *
 * [guestPage]
 *   - addInitScript로 window.ReactNativeWebView를 교체합니다.
 *   - initMockReactNativeWebView()가 "이미 존재하면 return" 하므로 guest mock 유지
 *   - auth:login 수신 → auth:error 즉시 dispatch → isAuthenticated = false
 *
 * .env.e2e 설정:
 *   VITE_E2E_ACCESS_TOKEN=카카오_로그인_후_발급된_실제_토큰
 */

type DoLinkFixtures = {
  /** 미인증 페이지 */
  guestPage: Page;
  /**
   * 인증 페이지 — VITE_E2E_ACCESS_TOKEN을 api.ts가 읽어 Zustand store에 주입합니다.
   * MockReactNativeWebView의 기존 흐름(auth:login → reissue())을 그대로 활용합니다.
   */
  authPage: Page;
};

const CONTEXT_OPTIONS = {
  viewport: { width: 390, height: 844 } as const,
  locale: 'ko-KR',
  timezoneId: 'Asia/Seoul',
};

/** 페이지 이동 후 앱 초기화(auth, API) 대기 시간 */
const NAVIGATION_SETTLE_MS = 5_000;

/**
 * page.goto를 래핑하여 이동 후 NAVIGATION_SETTLE_MS 만큼 자동 대기합니다.
 * 모든 테스트에서 별도 waitForTimeout 없이 안정적으로 동작합니다.
 */
function withSettleDelay(page: Page): Page {
  const originalGoto = page.goto.bind(page);
  page.goto = async (url: string, options?: Parameters<Page['goto']>[1]) => {
    const response = await originalGoto(url, options);
    await page.waitForTimeout(NAVIGATION_SETTLE_MS);
    return response;
  };
  return page;
}

export const test = base.extend<DoLinkFixtures>({
  guestPage: async ({ browser }, provide) => {
    const context = await browser.newContext(CONTEXT_OPTIONS);
    // initMockReactNativeWebView보다 먼저 실행되어 guest mock으로 교체
    await context.addInitScript(GUEST_BRIDGE_SCRIPT);
    const page = withSettleDelay(await context.newPage());
    await provide(page);
    await context.close();
  },

  authPage: async ({ browser }, provide) => {
    const context = await browser.newContext(CONTEXT_OPTIONS);
    // addInitScript 없음 — 앱의 MockReactNativeWebView + api.ts가 토큰을 처리
    const page = withSettleDelay(await context.newPage());
    await provide(page);
    await context.close();
  },
});

export { expect };
