<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/components — UI 컴포넌트

## Purpose

재사용 가능한 React UI 컴포넌트 모음. 기능 도메인별로 구분되며, `common/`에는 앱 전역에서 공유하는 공통 컴포넌트가 들어간다.

## Subdirectories

| Directory                | Purpose                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `common/appBar/`         | 페이지별 헤더/네비게이션 바 (home, back, search 변형)                                   |
| `common/background/`     | 그라디언트 배경 래퍼                                                                    |
| `common/bottomSheet/`    | 모달 바텀 시트 (base, archive 추가, todo)                                               |
| `common/button/`         | 버튼 변형 모음 (blue, grey, chip, cta, floating, icon, text, capsule 등)                |
| `common/feedBack/`       | 유저 피드백 UI (alertDialog, confirmDialog, toast, emptyNotice, modalLayout)            |
| `common/filter/`         | 필터/정렬 UI (categoryChip, dropDownMenu, itemChips, sortDropdown)                      |
| `common/icons/`          | SVG 아이콘 컴포넌트                                                                     |
| `common/infiniteScroll/` | IntersectionObserver 기반 무한 스크롤 컴포넌트                                          |
| `common/inputField/`     | 텍스트 입력 필드 (일반, 검색, clear 버튼 포함)                                          |
| `common/label/`          | 플래그/뱃지 레이블                                                                      |
| `common/line/`           | 구분선 (black, grey, vertical)                                                          |
| `common/list/`           | 리스트 아이템 (archiveCard, linkItem, todoItem, checkBox, 검색 결과)                    |
| `common/loading/`        | 로딩 스피너                                                                             |
| `common/menu/`           | 컨텍스트/옵션 메뉴                                                                      |
| `common/setting/`        | 설정 메뉴 아이템                                                                        |
| `common/tabBar/`         | 하단 탭 네비게이션 바                                                                   |
| `auth/`                  | `AuthProvider` — 앱 최상단에서 네이티브 브리지를 통한 초기 인증 처리                    |
| `archive/`               | 아카이브 관련 컴포넌트 (bottomSheet, input, select, summaryBar, filter, swipeable 카드) |
| `home/`                  | 홈 페이지 전용 섹션 컴포넌트 (archive, greeting, todo)                                  |
| `setting/`               | 설정 페이지 전용 컴포넌트 (radioOption)                                                 |
| `task/`                  | 태스크 전용 컴포넌트 (CollectionChipSelector)                                           |

## For AI Agents

- 새 공통 컴포넌트는 `common/` 하위 적절한 카테고리에 추가
- 도메인 전용 컴포넌트는 해당 도메인 폴더에 추가 (`archive/`, `home/`, `task/`, `setting/`)
- `AuthProvider`는 `src/routes/router.tsx`에서 앱 최상단을 감싸므로 반드시 하나만 존재해야 함
- 모든 스타일은 Tailwind CSS 유틸리티 클래스 사용. `tailwind.config.js`의 커스텀 토큰 우선 사용

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
