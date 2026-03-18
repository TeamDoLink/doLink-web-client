<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/stores — 전역 상태 관리 (Zustand)

## Purpose

Zustand를 사용한 클라이언트 전역 상태 관리. 서버 데이터는 React Query에서 처리하고, 여기서는 UI 상태와 인증 상태만 담당한다.

## Key Files

| File                       | Description                                                 |
| -------------------------- | ----------------------------------------------------------- |
| `useAuthStore.ts`          | 인증 상태 (accessToken, isAuthenticated, isAuthInitialized) |
| `useModalStore.ts`         | 알림/확인 다이얼로그 상태                                   |
| `useGlobalLoadingStore.ts` | 전역 로딩 상태                                              |
| `useArchiveUIStore.ts`     | 아카이브 화면 UI 상태 (선택된 카테고리 필터)                |
| `useTutorialTaskStore.ts`  | 온보딩 튜토리얼 진행 상태                                   |

## For AI Agents

- **서버 데이터는 여기에 저장하지 말 것**: 서버 응답 데이터는 React Query(`@tanstack/react-query`)가 캐싱 담당
- `useAuthStore`의 `accessToken`은 `src/api/axios-instance.ts`의 요청 인터셉터에서 자동으로 읽어 주입됨
- `isAuthInitialized`가 `false`인 동안에는 인증 초기화 중이므로 스플래시 화면 표시
- 새 전역 상태가 필요한 경우 이 폴더에 `use[Feature]Store.ts` 패턴으로 추가

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
