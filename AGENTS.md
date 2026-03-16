<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# doLink-web-client

## Purpose

doLink 서비스의 React 기반 웹 클라이언트. 링크·태스크 관리 기능을 제공하는 SPA(Single Page Application)로, 브라우저 환경과 모바일 앱의 WebView 환경을 모두 지원한다. Vite + React 19 + TypeScript 기반으로 구축되며, `doLink-app-client`의 WebView 내에서 렌더링되는 주요 UI 레이어이기도 하다.

## Key Files

| File                 | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `package.json`       | 의존성 및 npm 스크립트 정의                                                  |
| `vite.config.ts`     | Vite 설정 (React plugin, `@/` 경로 별칭, 개발 서버 포트 3000)                |
| `tsconfig.json`      | TypeScript 프로젝트 참조 설정                                                |
| `tsconfig.app.json`  | 앱 TS 설정 (ES2022, strict mode, 경로 별칭)                                  |
| `tailwind.config.js` | Tailwind CSS 설정 (커스텀 컬러·타이포그래피·z-index 토큰)                    |
| `eslint.config.js`   | ESLint 설정 (React hooks, React Refresh, Tailwind CSS 규칙)                  |
| `orval.config.js`    | OpenAPI 스펙(`http://localhost:8080/v3/api-docs`)으로부터 API 코드 자동 생성 |
| `.prettierrc.json`   | Prettier 포맷 설정                                                           |
| `.env`               | 로컬 API 베이스 URL(`http://localhost:8080`)                                 |
| `index.html`         | 앱 진입 HTML                                                                 |

## Subdirectories

| Directory         | Purpose                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| `src/api/`        | Axios 인스턴스 및 Orval 자동 생성 API 클라이언트 (`generated/endpoints/`, `generated/models/`) |
| `src/components/` | 재사용 가능한 React 컴포넌트 (auth, archive, home, task, setting, common)                      |
| `src/pages/`      | 페이지 단위 컴포넌트/라우트 (auth, home, archive, settings, task, search, splash)              |
| `src/routes/`     | React Router 라우팅 설정 (`router.tsx`)                                                        |
| `src/stores/`     | Zustand 전역 상태 (auth, modal, loading, archive UI, tutorial)                                 |
| `src/hooks/`      | 커스텀 React 훅 (네이티브 브리지, 네비게이션, 태스크 생성 등)                                  |
| `src/utils/`      | 유틸리티 함수 (nativeBridge, date, validation, webview 등)                                     |
| `src/constants/`  | 라우트 경로, API 엔드포인트 등 상수                                                            |
| `src/types/`      | TypeScript 타입 정의                                                                           |
| `src/styles/`     | 글로벌 CSS 및 Tailwind 설정                                                                    |
| `src/assets/`     | 아이콘(SVG), 폰트, 이미지, 로고                                                                |
| `src/mocks/`      | 개발용 목업 데이터                                                                             |

## For AI Agents

### Working In This Directory

- **경로 별칭**: `@/` → `src/` (tsconfig, vite.config 모두 동일)
- **API 코드는 절대 직접 수정하지 말 것**: `src/api/generated/` 하위 파일은 Orval로 자동 생성됨. 변경이 필요하면 OpenAPI 스펙을 수정한 후 `npm run generate:api`로 재생성
- **스타일링**: Tailwind CSS 유틸리티 클래스 사용. `tailwind.config.js`에 정의된 커스텀 토큰 우선 활용
- **상태 관리**: 서버 데이터는 React Query, 클라이언트 UI 상태는 Zustand 사용
- **네이티브 브리지**: 모바일 WebView에서 실행될 때는 `src/utils/nativeBridge.ts`를 통해 네이티브 앱과 통신

### Build & Test Commands

```bash
npm run dev           # 개발 서버 시작 (Vite, 포트 3000)
npm run build         # ESLint + TS 체크 + Vite 프로덕션 빌드
npm run lint          # ESLint 검사
npm run lint:fix      # ESLint 자동 수정
npm run preview       # 프로덕션 빌드 프리뷰
npm run format        # Prettier 포맷
npm run generate:api  # OpenAPI 스펙으로부터 API 코드 재생성
```

### Architecture Overview

```
Browser / WebView
      |
React Router (SPA routing)
      |
Pages (src/pages/)
      |
Components (src/components/)
      |
Hooks (src/hooks/)  ←→  Zustand Stores (src/stores/)
      |
API Layer (src/api/)
  ├── Axios Instance (axios-instance.ts)
  └── Generated Endpoints (generated/endpoints/)
      |
REST API Server (doLink-server)
```

**WebView 브리지 흐름:**

```
doLink-app-client (React Native WebView)
      ↕  postMessage / injectedJavaScript
doLink-web-client (src/utils/nativeBridge.ts)
```

## Dependencies

### Runtime

- `react` ^19.2.3, `react-dom` ^19.2.3 — React 19
- `react-router-dom` ^7.9.5 — SPA 라우팅
- `zustand` ^5.0.8 — 경량 전역 상태 관리
- `@tanstack/react-query` ^5.90.20 — 서버 상태 및 데이터 페칭
- `axios` ^1.13.4 — HTTP 클라이언트
- `tailwindcss` ^3.4.18 — 유틸리티 CSS 프레임워크

### Dev

- `vite` ^7.1.7 — 빌드 도구 및 개발 서버
- `typescript` ^5.9.3 — 타입 시스템
- `orval` — OpenAPI → TypeScript API 클라이언트 코드 생성
- `eslint`, `prettier` — 코드 품질
- `husky`, `lint-staged` — git pre-commit 훅

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
