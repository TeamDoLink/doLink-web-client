<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/pages — 페이지 컴포넌트

## Purpose

라우트에 대응하는 페이지 단위 컴포넌트. 각 페이지는 `src/routes/router.tsx`에 등록되며, 인증 상태에 따라 `beforeLogin` / `afterLogin` 두 가지 뷰를 가지는 패턴을 따른다.

## Subdirectories & Files

| Path                                            | Description                                          |
| ----------------------------------------------- | ---------------------------------------------------- |
| `auth/loginPage.tsx`                            | 로그인/인증 페이지                                   |
| `home/homePage.tsx`                             | 홈 진입점 (인증 상태에 따라 before/after 분기)       |
| `home/afterLogin.tsx`                           | 인증 후 홈 화면 (아카이브 섹션, 태스크 섹션, 인사말) |
| `home/beforeLogin.tsx`                          | 비인증 홈 화면                                       |
| `archive/archivePage.tsx`                       | 아카이브 목록 진입점 (before/after 분기)             |
| `archive/afterLogin.tsx`                        | 인증 후 아카이브 목록                                |
| `archive/beforeLogin.tsx`                       | 비인증 아카이브 화면                                 |
| `archive/archiveAddPage.tsx`                    | 새 아카이브 추가 페이지                              |
| `archive/archiveEditPage.tsx`                   | 기존 아카이브 편집 페이지                            |
| `archive/archiveDetailPage.tsx`                 | 아카이브 상세 뷰 (링크 목록)                         |
| `task/taskFormPage.tsx`                         | 태스크 생성/편집 폼 페이지                           |
| `task/detail.tsx`                               | 태스크 상세 뷰                                       |
| `settings/settingsPage.tsx`                     | 설정 메인 페이지                                     |
| `settings/withdrawal/withdrawalReasonPage.tsx`  | 회원 탈퇴 사유 선택 페이지                           |
| `settings/withdrawal/withdrawalConfirmPage.tsx` | 회원 탈퇴 최종 확인 페이지                           |
| `searchPage.tsx`                                | 검색 결과 페이지                                     |
| `splashScreen.tsx`                              | 스플래시/로딩 화면                                   |
| `test/`                                         | 개발용 테스트 페이지 (배포 대상 아님)                |

## For AI Agents

- 인증 분기 패턴: 최상위 페이지 파일(`homePage.tsx`, `archivePage.tsx`)에서 `useAuthStore`로 상태 확인 후 `afterLogin` / `beforeLogin` 컴포넌트로 분기
- `test/` 폴더의 파일들은 개발용으로만 존재하며 프로덕션 빌드에 포함되지 않도록 주의
- 새 페이지 추가 시 반드시 `src/routes/router.tsx`에 라우트 등록 필요
- 라우트 경로 상수는 `src/constants/routes.ts`에서 관리

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
