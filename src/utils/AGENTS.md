<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/utils — 유틸리티 함수

## Purpose

도메인 무관 범용 유틸리티 함수 모음. 네이티브 브리지 통신, 날짜 포맷, 검증, WebView 환경 감지 등을 포함한다.

## Key Files

| File                  | Description                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `nativeBridge.ts`     | React Native WebView와의 양방향 통신 유틸 (`sendMessageToRN`, `openLink`, `osShareTask`, `requestTokenReissue` 등) |
| `webview.ts`          | WebView 환경 감지 및 플랫폼 판별 (iOS/Android WebView 여부)                                                        |
| `date.ts`             | 날짜 포맷 유틸리티                                                                                                 |
| `validation.ts`       | 폼 입력값 검증 함수                                                                                                |
| `archiveCategory.ts`  | 아카이브 카테고리 타입 정의 및 레이블 매핑                                                                         |
| `versionCompare.ts`   | 앱 버전 비교 로직 (업데이트 필요 여부 판단)                                                                        |
| `openExternalLink.ts` | 외부 URL 열기 유틸                                                                                                 |

## Subdirectories

| Directory                 | Purpose                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `MockReactNativeWebView/` | 개발 환경에서 `window.ReactNativeWebView`를 모킹하는 개발용 유틸 |

## For AI Agents

- `nativeBridge.ts`의 함수들은 WebView 환경에서만 실제 동작하며, 일반 브라우저에서는 `webview.ts`의 감지 로직을 통해 폴백 처리됨
- `MockReactNativeWebView/`는 로컬 개발용으로만 사용. 프로덕션 코드에서 import 금지
- 카테고리 관련 새 로직은 `archiveCategory.ts`에 추가 (컴포넌트에 인라인 작성 금지)

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
