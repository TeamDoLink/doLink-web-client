<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/hooks — 커스텀 React 훅

## Purpose

컴포넌트에서 분리된 재사용 가능한 비즈니스 로직과 네이티브 브리지 연동 훅 모음.

## Key Files

| File                        | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `useBottomTabNavigation.ts` | 하단 탭 네비게이션 활성 상태 관리                          |
| `useClipboardBridge.ts`     | 네이티브 앱의 클립보드 읽기/쓰기 브리지 연동               |
| `useDraftBridge.ts`         | 폼 초안 저장/불러오기/삭제 브리지 연동 (AsyncStorage 기반) |
| `useNativeMessage.ts`       | 네이티브 앱으로부터 수신된 메시지 핸들러                   |
| `useNativeNavigate.ts`      | 네이티브 앱의 딥링크로부터 페이지 이동 처리                |
| `useTaskCreateAction.tsx`   | 태스크 생성 로직 (초안 관리 포함)                          |
| `useToast.ts`               | 토스트 알림 표시 훅                                        |

## For AI Agents

- 네이티브 브리지 훅(`useClipboardBridge`, `useDraftBridge`, `useNativeNavigate`)은 `src/utils/nativeBridge.ts`를 내부적으로 사용
- WebView가 아닌 환경(일반 브라우저)에서는 브리지 기능이 폴백 동작으로 처리됨 — `src/utils/webview.ts`의 환경 감지 함수 참고
- `useDraftBridge`는 태스크 폼 페이지에서 사용되며, 앱 종료 후 재진입 시 작성 중이던 내용을 복원함

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
