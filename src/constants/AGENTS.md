<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/constants — 상수 정의

## Purpose

앱 전역에서 사용하는 상수값 모음. 하드코딩 방지와 일관성 유지를 위해 모든 상수는 여기서 관리한다.

## Key Files

| File                 | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `routes.ts`          | React Router 라우트 경로 상수 (홈, 아카이브, 태스크, 설정 등) |
| `config.ts`          | API 엔드포인트 등 설정 상수                                   |
| `images.ts`          | 이미지/에셋 경로 상수                                         |
| `native.ts`          | 네이티브 브리지 가용 여부 플래그                              |
| `appVersion.ts`      | 현재 앱 버전 상수                                             |
| `beforeLoginData.ts` | 비인증 상태 화면용 기본/목업 데이터                           |
| `colors.ts`          | 컬러 팔레트 (현재 미사용, Tailwind 토큰 우선 사용)            |

## For AI Agents

- 라우트 경로는 항상 `routes.ts`에서 import. 컴포넌트에 경로 문자열 직접 작성 금지
- 이미지 경로는 `images.ts`를 통해 참조
- 새 상수 추가 시 관련 파일을 업데이트하거나 신규 파일을 이 폴더에 생성

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
