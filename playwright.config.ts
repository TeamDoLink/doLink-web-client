import { defineConfig, devices } from '@playwright/test';

/**
 * DoLink Web E2E 테스트 설정
 *
 * 인증 방식:
 *   - 앱은 React Native WebView native bridge를 통해 인증합니다.
 *   - 테스트에서는 e2e/helpers/bridge.ts의 mock script를 initScript로 주입합니다.
 *   - guestPage  fixture → auth:error  즉시 dispatch → 미인증 상태
 *   - authPage   fixture → auth:token  즉시 dispatch → 인증 상태
 *
 * 디렉토리 구조:
 *   e2e/
 *   ├── fixtures/       커스텀 fixture (guestPage, authPage)
 *   ├── helpers/        bridge mock 스크립트
 *   ├── guest/          DL_S01 미인증 테스트
 *   ├── authenticated/  DL_S02~S05 인증 테스트
 *   └── common/         인증 무관 공통 테스트
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',

  timeout: 30_000,
  expect: { timeout: 5_000 },

  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'e2e/playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 390, height: 844 },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  },

  projects: [
    {
      name: 'chromium-mobile',
      use: {
        browserName: 'chromium',
        // iPhone 14 스펙을 Chromium으로 에뮬레이션
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
