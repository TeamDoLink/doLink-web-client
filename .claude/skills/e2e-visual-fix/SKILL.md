---
name: e2e-visual-fix
description: DoLink 웹 E2E 테스트를 실행하고 실패한 테스트의 스크린샷을 시각적으로 분석하여 원인을 파악하고 소스 코드를 수정한다. Playwright 테스트 실패 후 코드 수정이 필요할 때 사용한다.
---

# E2E Visual Fix

Playwright E2E 테스트를 실행하고, 실패한 테스트의 스크린샷을 분석해 코드를 수정하는 워크플로우.

## 언제 사용하나

- E2E 테스트가 실패했고 스크린샷으로 원인을 파악하고 싶을 때
- UI 버그(두 줄 개행, 이미지 깨짐, 잘못된 라우팅 등)를 자동으로 수정하고 싶을 때

## 실행 단계

### 1. 테스트 실행

```bash
cd doLink-web-client
npx playwright test [파일명] --reporter=list
```

특정 테스트만 실행하려면:

```bash
npx playwright test --grep "테스트명"
```

### 2. 스크린샷 수집

실패한 테스트의 스크린샷은 자동으로 저장된다:

```
e2e/test-results/{테스트명}-chromium-mobile/
  ├── test-failed-1.png
  └── error-context.md
```

Read 툴로 각 `test-failed-1.png` 이미지를 열어 시각적으로 분석한다.

### 3. 시각 분석 → 코드 수정

분석 결과를 바탕으로 소스 파일을 직접 수정한다.
자세한 분석 기준과 수정 패턴은 `references/visual-analysis.md` 참고.

### 4. 재테스트로 검증

```bash
npx playwright test --grep "수정한_테스트명"
```

## 결과 해석

| 결과       | 조치                                      |
| ---------- | ----------------------------------------- |
| ✅ passed  | 완료                                      |
| ❌ failed  | 스크린샷 분석 후 코드 수정                |
| ⏭ skipped | `data-testid` 누락 — 컴포넌트에 추가 필요 |

## References

- `references/visual-analysis.md` — 시각 분석 기준 및 수정 패턴
- `references/test-structure.md` — 테스트 파일 구조 및 fixture 설명
