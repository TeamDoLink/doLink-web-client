# Share Token 기능 구현 계획

## 개요

공유 토큰 기반 할 일 공유 기능을 구현한다.

- `osShareTask`: 공유 토큰을 발급받아 `/share/{token}` URL을 OS 공유 시트로 전달
- `/share/:token` 라우트: `task/detail.tsx`를 그대로 재사용
- `useTaskDetailNavigation` 훅: URL 경로에 따라 데이터 소스를 분기하여 동일한 타입(`ApiResponseTaskResponse`)으로 반환

---

## 현재 상태 분석

### `osShareTask` (현재)

```typescript
export const osShareTask = (taskId: number): void => {
  const url = `https://app.dolink.team/task/detail/${taskId}`;
  sendMessageToRN({ type: 'os:share', payload: { url } });
};
```

- 인증이 필요한 task/detail URL을 그대로 공유 중
- 공유 토큰 없이 taskId가 URL에 직접 노출됨

### Share API (이미 생성됨, `src/api/generated/endpoints/share/share.ts`)

- `createShareToken(taskId)` — `POST /api/v1/task/{taskId}/share` (로그인 필요)
- `useGetSharedTask(shareToken)` — `GET /api/v1/share/task/{shareToken}` (인증 불필요)
- `useGetSharedTask` 응답 구조는 `useGetTask`와 동일 → `ApiResponseTaskResponse`로 캐스팅 가능

---

## 구현 범위

### Feature 1 — `osShareTask` 수정

**대상 파일:** `src/utils/nativeBridge.ts`

`async`로 변경하여 공유 토큰을 발급받고 `/share/{token}` URL을 구성한다.

```typescript
export const osShareTask = async (taskId: number): Promise<void> => {
  const response = await createShareToken(taskId);
  const data = response as unknown as ApiResponseShareTokenResponse;
  const shareToken = data?.result?.shareToken;
  if (!shareToken) return;

  const url = `https://app.dolink.team/share/${shareToken}`;
  sendMessageToRN({ type: 'os:share', payload: { url } });
};
```

**추가 import:**

- `createShareToken` (`src/api/generated/endpoints/share/share.ts`)
- `ApiResponseShareTokenResponse` (`src/api/generated/models`)

---

### Feature 2 — `useTaskDetailNavigation` 훅 신규 생성

**신규 파일:** `src/hooks/useTaskDetailNavigation.ts`

URL 경로를 보고 데이터 소스를 분기하여 `ApiResponseTaskResponse` 형태로 통일된 데이터를 반환한다.

```typescript
// 반환 타입 (task/detail.tsx 기존 패턴과 동일)
type UseTaskDetailNavigationReturn = {
  taskData: TaskResponse | null | undefined;
  isLoading: boolean;
  isShareMode: boolean; // 공유 페이지 여부 (옵션 메뉴, 완료 버튼 숨김 판단용)
};
```

**내부 동작:**

```
URL에 '/share' 포함 여부 판단 (useLocation)
  ├── true  → useParams: token
  │          → useGetSharedTask(token)
  │          → 응답 as unknown as ApiResponseTaskResponse
  │          → taskData = result
  │
  └── false → useParams: id
             → useGetTask(Number(id)), enabled: isAuthenticated
             → 응답 as unknown as ApiResponseTaskResponse
             → taskData = result
```

---

### Feature 3 — `task/detail.tsx` 데이터 패치 부분 교체

**대상 파일:** `src/pages/task/detail.tsx`

기존 데이터 패치 코드를 `useTaskDetailNavigation` 훅으로 교체한다.

**변경 전:**

```typescript
const { data: taskResponse, isLoading: isLoadingTask } = useGetTask(taskId, {
  query: { enabled: isAuthenticated },
});
const apiTaskResponse = taskResponse as unknown as ApiResponseTaskResponse;
const taskData = shouldUseMockData ? null : apiTaskResponse?.result;
```

**변경 후:**

```typescript
const {
  taskData,
  isLoading: isLoadingTask,
  isShareMode,
} = useTaskDetailNavigation();
```

`isShareMode`가 `true`이면 완료하기 버튼을 렌더링하지 않는다.

옵션 메뉴(`...`)는 `isShareMode`가 아닌 **`taskData.isOwner`** 값으로 제어한다.

- `isOwner: true` → 옵션 메뉴 표시 (수정/삭제)
- `isOwner: false` → 옵션 메뉴 숨김 (타인이 공유 링크로 접근한 경우)

`isOwner`는 `TaskResponse` 모델에 이미 정의되어 있으므로 (`taskData.isOwner`) 별도 처리 없이 바로 사용 가능.

---

### Feature 4 — 라우트 추가

**`src/constants/routes.ts`:**

```typescript
shareTask: '/share',
```

**`src/routes/router.tsx`:**

```typescript
// /share/:token → task/detail.tsx 그대로 재사용
<Route path={`${ROUTES.shareTask}/:token`} element={<TaskDetailPage />} />
```

---

### Feature 5 — `archiveDetailPage.tsx` 호출부 대응

**대상 파일:** `src/pages/archive/archiveDetailPage.tsx`

`osShareTask`가 `async`로 변경되므로 래퍼 함수를 정의하여 Promise 처리.

```typescript
const handleShareTask = async (taskId: number) => {
  await osShareTask(taskId);
};

// 사용
onShareClick={(taskId) => {
  void handleShareTask(taskId);
}}
```

추후 실패 시 토스트 표시 등 에러 핸들링을 `handleShareTask` 내에서 확장 가능.

---

## 파일 변경 목록 요약

| 파일                                      | 변경 종류                                                 |
| ----------------------------------------- | --------------------------------------------------------- |
| `src/utils/nativeBridge.ts`               | 수정 — `osShareTask` async 변경, 토큰 발급 로직 추가      |
| `src/hooks/useTaskDetailNavigation.ts`    | **신규 생성** — URL 기반 데이터 소스 분기 훅              |
| `src/pages/task/detail.tsx`               | 수정 — 데이터 패치 부분을 훅으로 교체, `isShareMode` 분기 |
| `src/constants/routes.ts`                 | 수정 — `shareTask: '/share'` 추가                         |
| `src/routes/router.tsx`                   | 수정 — `/share/:token` 라우트 등록                        |
| `src/pages/archive/archiveDetailPage.tsx` | 수정 — `handleShareTask` 래퍼 함수 추가                   |

---

## 구현 순서

1. `routes.ts`에 `shareTask` 추가
2. `useTaskDetailNavigation.ts` 훅 구현
3. `task/detail.tsx` 데이터 패치 부분 훅으로 교체
4. `router.tsx`에 `/share/:token` 라우트 등록
5. `nativeBridge.ts`의 `osShareTask` async 수정
6. `archiveDetailPage.tsx` `handleShareTask` 래퍼 추가
