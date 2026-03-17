/**
 * DL_S01 — 로그인 없이 둘러보기
 * 미인증(게스트) 상태에서의 기능 동작을 검증합니다.
 */
import { test, expect } from '../fixtures';

test.describe('DL_S01 로그인 없이 둘러보기', () => {
  test.beforeEach(async ({ guestPage }) => {
    await guestPage.goto('/');
    // auth:error 수신 후 앱이 초기화될 때까지 대기
    await guestPage.waitForFunction(
      () =>
        document.querySelector('[data-testid="home-before-login"]') !== null ||
        document.querySelector('[data-testid="splash-screen"]') === null
    );
  });

  // -------------------------------------------------------
  // DL_S01_T02 | 홈화면 할 일 체크박스 — 미로그인 시 완료 처리 차단
  // -------------------------------------------------------
  test('DL_S01_T02: 미로그인 상태에서 할 일 체크박스 클릭 시 로그인 유도 팝업 노출', async ({
    guestPage,
  }) => {
    await guestPage.goto('/');

    const checkbox = guestPage.getByTestId('task-checkbox').first();

    await checkbox.click();

    await expect(
      guestPage.getByText('로그인 후 간편하게 DoLink를 이용해보세요.')
    ).toBeVisible();

    // 완료 처리가 되어선 안 된다 (checkbox가 checked 상태 X)
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  // -------------------------------------------------------
  // DL_S01_T15 | 할 일 상세 완료하기 — 미로그인 시 차단
  // -------------------------------------------------------
  test('DL_S01_T15: 미로그인 상태에서 [완료하기] 버튼은 로그인을 유도해야 한다', async ({
    guestPage,
  }) => {
    // 기본 제공 할 일 상세 페이지로 직접 이동
    await guestPage.goto('/task/detail/1');

    const completeBtn = guestPage.getByRole('button', { name: /완료하기/i });
    await completeBtn.click();

    await expect(
      guestPage.getByText(/로그인 후 간편하게|로그인하기/i)
    ).toBeVisible();
  });

  // -------------------------------------------------------
  // DL_S01_T07 | 헤더 검색 — 미로그인 검색 동작
  // -------------------------------------------------------
  test('DL_S01_T07: 미로그인 상태에서 검색창으로 이동 가능', async ({
    guestPage,
  }) => {
    await guestPage.goto('/');

    const searchBtn = guestPage.getByRole('button', { name: /검색/i });
    await searchBtn.click();

    await expect(guestPage).toHaveURL(/search/);
    await expect(guestPage.getByRole('searchbox')).toBeVisible();
  });

  // -------------------------------------------------------
  // DL_S01_T12 | 홈화면 할 일 클릭 — 상세 페이지 이동
  // -------------------------------------------------------
  test('DL_S01_T12: 기본 제공 할 일 클릭 시 할 일 상세 페이지로 이동', async ({
    guestPage,
  }) => {
    await guestPage.goto('/');

    const taskItem = guestPage.getByTestId('task-item').first();
    await taskItem.click();
    await expect(guestPage).toHaveURL(/task\/detail/);
  });

  // -------------------------------------------------------
  // DL_S01_T28 | 모음 상세 → 하단바 [모음] 클릭 시 모음 화면 이동
  // -------------------------------------------------------
  test('DL_S01_T28: 모음 상세에서 하단 네비바 [모음] 클릭 시 모음 목록으로 이동', async ({
    guestPage,
  }) => {
    await guestPage.goto('/archives/tutorial');

    const archiveNavBtn = guestPage.getByTestId('bottom-tab-archive');

    await archiveNavBtn.click();
    await expect(guestPage).toHaveURL('/archives');
  });

  // -------------------------------------------------------
  // DL_S01_T05 | 팝업 문구 — 로그인 버튼 한 줄 표시
  // -------------------------------------------------------
  test('DL_S01_T05: 로그인 유도 팝업 내 [로그인] 버튼이 한 줄로 노출', async ({
    guestPage,
  }) => {
    await guestPage.goto('/');

    await guestPage
      .getByRole('button', { name: /^더보기$/i })
      .first()
      .click();
    const deleteBtn = guestPage.getByRole('button', { name: /삭제/i }).first();
    await deleteBtn.click();

    const loginBtn = guestPage.getByRole('button', { name: /로그인/i });
    await expect(loginBtn).toBeVisible();

    // 버튼이 두 줄로 잘리지 않아야 한다 (line-clamp 또는 white-space: nowrap 확인)
    const isOneLine = await loginBtn.evaluate((el) => {
      return el.scrollHeight <= el.clientHeight + 4;
    });
    expect(isOneLine).toBe(true);
  });
});
