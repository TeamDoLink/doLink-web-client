<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/assets — 정적 에셋

## Purpose

아이콘, 폰트, 이미지, 로고 등 정적 파일 모음. 에셋 경로는 `src/constants/images.ts`를 통해 참조한다.

## Subdirectories

| Directory | Purpose                                                              |
| --------- | -------------------------------------------------------------------- |
| `icons/`  | SVG 아이콘 파일 (auth, category, home, tabs, common 카테고리별 구분) |
| `fonts/`  | 웹 폰트 파일                                                         |
| `images/` | 일반 이미지 파일                                                     |
| `logos/`  | 브랜드 로고                                                          |

## For AI Agents

- 새 에셋 추가 후 `src/constants/images.ts`에 경로 상수 등록
- SVG 아이콘은 기능 카테고리별 폴더에 분류하여 추가
- 폰트 파일 추가 시 `src/styles/global.css`에 `@font-face` 선언도 함께 추가 필요

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
