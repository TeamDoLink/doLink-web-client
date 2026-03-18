<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/api — API 통신 레이어

## Purpose

백엔드 서버와의 HTTP 통신을 담당한다. Axios 인스턴스 설정과 Orval로 자동 생성된 타입 안전 API 클라이언트를 포함한다.

## Key Files

| File                | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| `axios-instance.ts` | Axios 인스턴스 생성 및 인터셉터 설정 (Bearer 토큰 주입, 401 처리) |
| `appVersion.ts`     | 백엔드에서 앱 버전 정보 조회 및 검증                              |

## Subdirectories

| Directory              | Purpose                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| `generated/endpoints/` | Orval 자동 생성 API 엔드포인트 함수 (auth, collection, link, search, task, user) |
| `generated/models/`    | Orval 자동 생성 TypeScript 타입 정의 (요청/응답 DTO 50개 이상)                   |

## For AI Agents

- **`generated/` 하위 파일 절대 수정 금지**: Orval이 OpenAPI 스펙(`http://localhost:8080/v3/api-docs`)으로부터 자동 생성. 수정이 필요하면 루트의 `orval.config.js`를 변경하고 `npm run generate:api` 재실행
- `axios-instance.ts`에는 Orval과 호환되는 커스텀 `request` 함수가 포함되어 있어 인스턴스를 직접 사용하는 대신 이 함수를 Orval 설정에 연결함
- 인증 토큰은 `useAuthStore`에서 가져오며, 요청 인터셉터에서 `Authorization: Bearer <token>` 헤더로 주입됨
- 401 응답 시 네이티브 브리지(`nativeBridge.ts`)를 통해 토큰 재발급 요청을 앱에 위임

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
