# DoLink API 연결 계획

## 1. 현황 요약

### 기술 스택

- React 19 + TypeScript + Vite
- TanStack React Query (데이터 패칭)
- Zustand (상태 관리)
- Orval (OpenAPI → React Query 훅 자동 생성)
- Axios (커스텀 인스턴스 + 토큰 재발급 인터셉터)

### API 연결 현황

| 엔드포인트                                    | 설명             | 상태               | Orval 훅                      | 사용 위치                    |
| --------------------------------------------- | ---------------- | ------------------ | ----------------------------- | ---------------------------- |
| `POST /v1/auth/reissue`                       | 토큰 재발급      | ✅ 연결됨          | `useIssueAccessToken`         | axios-instance.ts (인터셉터) |
| `POST /v1/user/logout`                        | 로그아웃         | ✅ 연결됨          | `logout` (함수)               | Settings, WithdrawalConfirm  |
| `GET /v1/user/profile`                        | 사용자 정보      | ✅ 연결됨          | `useGetUser`                  | Home, Settings               |
| `DELETE /v1/user/profile`                     | 회원탈퇴         | ✅ 연결됨          | `useWithdraw`                 | WithdrawalConfirm            |
| `POST /api/v1/collect`                        | 모음 생성        | ✅ 연결됨          | `useCreateCollect`            | ArchiveAdd                   |
| `PATCH /api/v1/collect/{id}`                  | 모음 수정        | ✅ 연결됨          | `useUpdateCollect`            | ArchiveEdit                  |
| `DELETE /api/v1/collect/{id}`                 | 모음 삭제        | ✅ 연결됨          | `useDeleteCollect`            | Home, Archive, ArchiveDetail |
| `GET /api/v1/collect/all`                     | 모음 전체 조회   | ✅ 연결됨          | `useListAll1`                 | Home, Archive                |
| `GET /api/v1/collect/category`                | 카테고리별 조회  | ✅ 연결됨          | `useListByCategory`           | Archive                      |
| `GET /api/v1/collect/select`                  | 모음 선택 목록   | ✅ 연결됨          | `useListCollectSelectOptions` | TaskCreate                   |
| `GET /api/v1/collect/{id}`                    | 모음 상세 정보   | ✅ 연결됨          | `useGetCollectDetail`         | ArchiveDetail, ArchiveEdit   |
| `POST /api/v1/task`                           | 할 일 추가       | ✅ 연결됨          | `useCreate`                   | TaskCreate                   |
| `GET /api/v1/task`                            | 전체 할 일 조회  | ❌ 미연결          | `useListAll`                  | —                            |
| `GET /api/v1/task/{id}`                       | 할 일 상세 조회  | ❌ 미연결          | `useGetTask`                  | TaskDetail (Mock 사용 중)    |
| `PATCH /api/v1/task/{id}`                     | 할 일 수정       | ❌ 미연결          | `useUpdateTask`               | —                            |
| `DELETE /api/v1/task/{id}`                    | 할 일 삭제       | ✅ 연결됨          | `useDeleteTask`               | ArchiveDetail                |
| `PATCH /api/v1/task/{id}/toggle`              | 할 일 상태 토글  | ✅ 연결됨          | `useCompleteTask`             | Home, ArchiveDetail          |
| `GET /api/v1/task/recent`                     | 최근 할 일 조회  | ✅ 연결됨          | `useListRecent`               | Home                         |
| `GET /api/v1/task/collections/{collectionId}` | 모음별 Task 조회 | ✅ 연결됨          | `useListByCollection`         | ArchiveDetail                |
| `GET /api/v1/search/tasks`                    | 할 일 검색       | ❌ 미연결          | `useSearchTasks`              | —                            |
| `GET /api/v1/search/collections`              | 모음 검색        | ❌ 미연결          | `useSearchCollections`        | —                            |
| `POST /api/v1/link/preview`                   | 링크 미리보기    | ❌ 미연결 (미필요) | `usePreview`                  | —                            |

> **✅ 연결됨: 16개 / ❌ 미연결: 6개** (총 22개 엔드포인트)

---

## 2. 페이지별 API 연결 상태

| 페이지         | 라우트                         | 현재 상태        | 사용 API                                                                                             | 무한 스크롤               |
| -------------- | ------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------- | ------------------------- |
| 홈 (로그인 후) | `/`                            | ✅ API 연결 완료 | `useGetUser`, `useListRecent`, `useListAll1`, `useCompleteTask`, `useDeleteCollect`                  | ▶ 미적용                 |
| 모음 목록      | `/archives`                    | ✅ API 연결 완료 | `useListAll1`, `useListByCategory`, `useDeleteCollect`                                               | ▶ 고정 (page:0, size:10) |
| 모음 추가      | `/archives/add`                | ✅ API 연결 완료 | `useCreateCollect`                                                                                   | —                         |
| 모음 수정      | `/archives/edit/:id`           | ✅ API 연결 완료 | `useGetCollectDetail`, `useUpdateCollect`                                                            | —                         |
| 모음 상세      | `/archives/detail/:id`         | ✅ API 연결 완료 | `useListByCollection`, `useGetCollectDetail`, `useCompleteTask`, `useDeleteTask`, `useDeleteCollect` | ▶ 고정 (페이징 미적용)   |
| 할 일 생성     | `/task/create`                 | ✅ API 연결 완료 | `useCreate`, `useListCollectSelectOptions`                                                           | —                         |
| 할 일 상세     | `/task/detail`                 | ⚠️ Mock 사용 중  | MOCK_TASK_DATA 상수 사용 (API 미연동)                                                                | —                         |
| 설정           | `/settings`                    | ✅ API 연결 완료 | `useGetUser`, `logout`                                                                               | —                         |
| 회원탈퇴 확인  | `/settings/withdrawal/confirm` | ✅ API 연결 완료 | `useWithdraw`, `logout`                                                                              | —                         |
| 검색           | —                              | ❌ 라우트 미구현 | 라우트 및 페이지 모두 미구현                                                                         | —                         |

> ▶ = API는 페이징을 지원하지만, 클라이언트에서 `useInfiniteQuery` 전환이 아직 이루어지지 않은 상태 (고정 page/size로 첫 페이지만 조회 중)

---

## 3. 구현 계획 (잔여 과제)

### Phase 2: 할 일 상세 페이지 및 무한 스크롤 API 연동

#### 2-1. 할 일 상세 (`/task/detail` → `/task/detail/:taskId`로 변경 필요)

- **대상**: `src/pages/task/detail.tsx`
- **현재 상태**: MOCK_TASK_DATA 상수 사용, API 임포트 없음
- **연동 API**:
  - `GET /api/v1/task/{id}` (`useGetTask`): 할 일 정보 조회 및 표시
  - `PATCH /api/v1/task/{id}/toggle` (`useCompleteTask`): 완료 상태 토글
  - `DELETE /api/v1/task/{id}` (`useDeleteTask`): 할 일 삭제
  - `PATCH /api/v1/task/{id}` (`useUpdateTask`): 할 일 정보(제목, 메모 등) 수정
- **작업 내용**:
  - 라우트를 `/task/detail/:taskId`로 변경 (URL 파라미터 기반)
  - MOCK_TASK_DATA 제거 및 실제 API 결과 반영
  - 수정/삭제 모드 대응

#### 2-2. 무한 스크롤 전환 (▶ 현재 고정 페이징 → `useInfiniteQuery`)

현재 아래 페이지들은 API 연결은 완료되었으나, 고정 `page:0, size:10`으로 첫 페이지만 조회하는 상태입니다. `useInfiniteQuery`로 전환이 필요합니다.

| 대상 페이지                                     | 현재 상태                                | 전환 대상 API                              | 비고                 |
| ----------------------------------------------- | ---------------------------------------- | ------------------------------------------ | -------------------- |
| 모음 목록 - 전체 조회 (`afterLogin.tsx`)        | ▶ `useListAll(page:0, size:10)`         | `useListAll` → `useInfiniteQuery`          | `TODO` 주석 남아있음 |
| 모음 목록 - 카테고리별 조회 (`afterLogin.tsx`)  | ▶ `useListByCategory(page:0, size:10)`  | `useListByCategory` → `useInfiniteQuery`   | `TODO` 주석 남아있음 |
| 모음 상세 - 할일 목록 (`archiveDetailPage.tsx`) | ▶ `useListByCollection` (페이징 미적용) | `useListByCollection` → `useInfiniteQuery` | API는 페이징 지원    |

- **공통 구현 방식**:
  - `useInfiniteQuery`를 활용한 페이징 처리
  - `size=20` 고정 파라미터 적용
  - `IntersectionObserver` 기반의 하단 도달 감지 및 `fetchNextPage` 트리거
  - 데이터 평탄화 및 날짜별 그룹화 로직 유지

#### 2-3. 전체 할 일 목록 (필요 시 신규 페이지)

- **연동 API**: `GET /api/v1/task` (`useListAll`)
- **내용**: 사용자의 모든 할 일을 최신순으로 무한 스크롤 조회

---

### Phase 5: 검색 기능 (신규 페이지)

현재 검색 라우트 및 페이지 미구현. 전역 검색 아이콘만 존재.

#### 5-1. 검색 페이지 구현

- 라우트 추가: `/search`
- `GET /api/v1/search/tasks` (`useSearchTasks`), `GET /api/v1/search/collections` (`useSearchCollections`) 활용
- 탭 구분(할 일/모음) 결과 표시

---

## 4. 기완료 리팩토링 사항

- **location.state 제거**: 모든 페이지 이동 시 데이터 의존성을 URL 파라미터(`:id`)로 통일함.
- **타입 안정성**: `as any` 캐스팅을 `ApiResponse...` 타입으로 교체 진행 중.
- **쿼리 무효화**: 삭제/수정 시 관련 캐시(`getListAll`, `getGetCollectDetail` 등)를 즉시 무효화하여 싱크 유지.
- **역매핑 로직**: 한글 카테고리 레이블을 API용 영문 키로 변환하는 `CATEGORY_LABEL_TO_KEY` 통일 적용.
