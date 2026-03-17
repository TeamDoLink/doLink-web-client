<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/routes — 라우팅 설정

## Purpose

React Router v7 기반 SPA 라우팅 설정. 앱의 모든 URL 경로와 페이지 컴포넌트를 연결한다.

## Key Files

| File         | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| `router.tsx` | 전체 라우트 정의. `AuthProvider`로 앱을 감싸며, 테스트 페이지는 lazy-load 처리 |

## For AI Agents

- 라우트 경로 문자열은 `src/constants/routes.ts`에서 상수로 관리. 하드코딩 금지
- 새 페이지 추가 시 이 파일에 라우트 항목 추가 필요
- 테스트 경로(`/test*`)는 lazy import로 처리되어 있으므로 같은 패턴 유지

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
