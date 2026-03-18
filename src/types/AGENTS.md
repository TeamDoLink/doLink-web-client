<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/types — TypeScript 타입 정의

## Purpose

앱 전반에서 공유하는 TypeScript 타입 및 인터페이스 정의. API 자동 생성 타입(`src/api/generated/models/`)과는 별개로, 클라이언트 전용 타입을 관리한다.

## Key Files

| File           | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `index.ts`     | 핵심 도메인 타입 (TodoItem, ArchiveItem 등)                          |
| `native.ts`    | 네이티브 브리지 메시지 타입 (Link, Auth, OsShare, Navigation 메시지) |
| `clipboard.ts` | 클립보드 브리지 요청/응답 타입                                       |
| `draft.ts`     | 폼 초안 저장/복원 타입                                               |

## For AI Agents

- API 응답/요청 타입은 여기에 추가하지 말 것 — `src/api/generated/models/`에 자동 생성됨
- 네이티브 브리지 메시지 구조가 변경되면 `native.ts`를 먼저 업데이트하고, `src/utils/nativeBridge.ts`와 `src/hooks/`의 브리지 훅도 함께 수정 필요

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
