# 테스트 파일 구조 및 Fixture 설명

## 디렉토리 구조

```
doLink-web-client/
├── playwright.config.ts         # 브라우저: Chromium, 뷰포트: 390x844
└── e2e/
    ├── fixtures/index.ts        # guestPage / authPage fixture
    ├── helpers/bridge.ts        # Native bridge mock 스크립트
    ├── guest/                   # DL_S01 미인증 테스트
    ├── authenticated/           # DL_S02~S05 인증 테스트
    ├── common/                  # 공통 네비게이션 테스트
    └── test-results/            # 실패 스크린샷 저장 위치
```

## Fixture

| Fixture     | 인증 상태 | 설명                                                               |
| ----------- | --------- | ------------------------------------------------------------------ |
| `guestPage` | ❌ 미인증 | bridge mock이 `auth:error` dispatch → `isAuthenticated = false`    |
| `authPage`  | ✅ 인증   | `MockReactNativeWebView` + `api.ts`가 `VITE_E2E_ACCESS_TOKEN` 반환 |

## 인증 토큰 설정

`.env.e2e` 파일에 실제 카카오 토큰 입력:

```
VITE_E2E_ACCESS_TOKEN=실제_토큰
```

미설정 시 mock 토큰 사용 (API 호출 실패하지만 UI 상태는 인증됨).

## 페이지 이동 후 대기

`guestPage.goto()` / `authPage.goto()` 호출 시 자동으로 **5초 대기** 후 테스트 진행.
`fixtures/index.ts`의 `withSettleDelay()`가 적용됨.

## skipped 테스트 활성화 방법

테스트가 `skipped`로 표시되면 해당 컴포넌트에 `data-testid`가 없는 것:

```tsx
// 컴포넌트에 추가
<div data-testid="archive-card">...</div>
<button data-testid="submit-button">...</button>
```
