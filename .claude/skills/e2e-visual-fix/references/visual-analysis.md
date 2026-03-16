# 시각 분석 기준 및 수정 패턴

## 분석 항목별 확인 포인트

### 텍스트 두 줄 개행

- 버튼, 레이블 텍스트가 두 줄로 잘린 경우
- 수정: `whitespace-nowrap` 또는 `truncate` Tailwind 클래스 추가

```tsx
// 수정 전
<button>의견보내기</button>
// 수정 후
<button className="whitespace-nowrap">의견보내기</button>
```

### 이미지 깨짐 (빈 영역 또는 alt 텍스트 표시)

- `<img>` naturalWidth === 0 이면 로드 실패
- 확인: `src` 경로, import 경로, 서버 응답
- 수정: 경로 수정 또는 fallback 이미지 추가

### 버튼 상태 오류 (disabled/enabled 반전)

- 버튼이 활성화돼야 할 때 비활성, 또는 반대인 경우
- 확인: `disabled={조건}` prop 로직
- 수정: 조건식 반전 또는 상태 초기값 수정

### 잘못된 라우팅

- 클릭 후 의도한 URL이 아닌 다른 경로로 이동
- 확인: `navigate()` 경로, `<Link to=...>` 값, `ROUTES` 상수
- 수정: 올바른 라우트 상수로 교체

### 레이아웃 깨짐 (요소 겹침 / 여백 이상)

- 요소가 다른 요소 위에 겹쳐 보이는 경우
- 확인: `z-index`, `position`, `overflow` 속성
- 수정: Tailwind 레이아웃 클래스 조정

### 바텀시트가 별도 화면처럼 노출

- 바텀시트가 기존 화면 위에 overlay되지 않고 full-screen으로 전환
- 확인: `position: fixed`, `z-index`, 라우터 이동 여부
- 수정: 별도 route로 이동하는 코드 제거, overlay 방식으로 변경

## 스크린샷과 테스트 ID 매핑

스크린샷 경로에서 테스트 ID를 추출한다:

```
e2e/test-results/authenticated-s02-auth-DL_S02_T07-.../test-failed-1.png
                              ↑ 파일명         ↑ 테스트 ID
```

테스트 ID → TASK.md에서 관련 컴포넌트 파악 → 소스 파일 수정
