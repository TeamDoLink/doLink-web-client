/**
 * DL_S03 — 모음 (Archive)
 * 로그인 상태에서의 모음 CRUD 및 네비게이션을 검증합니다.
 */
import { test, expect } from '../fixtures';

test.describe('DL_S03 모음', () => {
  // -------------------------------------------------------
  // DL_S03_T01 | 모음 상세 → 하단바 [모음] 클릭 시 목록 이동
  // -------------------------------------------------------
  test('DL_S03_T01: 모음 상세에서 하단 네비바 [모음] 클릭 시 모음 목록으로 이동', async ({
    authPage,
  }) => {
    await authPage.goto('/archives/tutorial');

    const archiveTab = authPage.getByTestId('bottom-tab-archive');

    await archiveTab.click();
    await expect(authPage).toHaveURL('/archives');
  });

  // -------------------------------------------------------
  // DL_S03_T02 | 모음 전체 카운트 — 사용자 기준
  // -------------------------------------------------------
  test('DL_S03_T02: 모음 목록의 전체 카운트는 사용자 보유 모음 수와 일치', async ({
    authPage,
  }) => {
    await authPage.goto('/archives');
    await authPage.waitForLoadState('networkidle');

    const allTab = authPage.getByRole('tab', { name: /전체/i });
    await allTab.click();

    // 실제 모음 카드 수를 세어 전체 카운트와 비교
    const archiveCards = authPage.getByTestId('archive-card');
    const cardCount = await archiveCards.count();
    const countBadge = authPage.getByTestId('archive-total-count');
    if ((await countBadge.count()) > 0) {
      const badgeText = await countBadge.textContent();
      expect(badgeText).toContain(String(cardCount));
    }
  });

  // -------------------------------------------------------
  // DL_S03_T05 | 모음 추가 — 바텀시트 동작
  // -------------------------------------------------------
  test('DL_S03_T05: [+모음 추가] 클릭 시 바텀시트가 현재 화면 위에 노출', async ({
    authPage,
  }) => {
    await authPage.goto('/archives');

    const addBtn = authPage.getByTestId('archive-add-button');
    await addBtn.click();

    // 바텀시트가 열려야 한다
    const bottomSheet = authPage.getByTestId('bottom-sheet');
    await expect(bottomSheet).toBeVisible();

    // URL이 변경되지 않아야 한다 (별도 화면이 아닌 바텀시트)
    await expect(authPage).toHaveURL('/archives');
  });

  // -------------------------------------------------------
  // DL_S03_T07 | 모음 추가 — 20자 제한
  // -------------------------------------------------------
  test('DL_S03_T07: 모음 이름 20자 초과 입력이 제한된다', async ({
    authPage,
  }) => {
    await authPage.goto('/archives/add');

    const titleInput = authPage.getByTestId('archive-name-input');

    const longText = 'a'.repeat(25);
    await titleInput.fill(longText);

    // 20자까지만 입력되어야 한다
    const value = await titleInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(20);
  });

  // -------------------------------------------------------
  // DL_S03_T07 | 카테고리 '자기개발' 한 줄 표시
  // -------------------------------------------------------
  test('DL_S03_T07: 카테고리 [자기개발] 버튼이 한 줄로 노출', async ({
    authPage,
  }) => {
    await authPage.goto('/archives/add');

    const selfDevBtn = authPage.getByRole('button', { name: /자기개발/i });
    await expect(selfDevBtn).toBeVisible();

    const isOneLine = await selfDevBtn.evaluate((el) => {
      return el.scrollHeight <= el.clientHeight + 4;
    });
    expect(isOneLine).toBe(true);
  });

  // -------------------------------------------------------
  // DL_S03_T34 | 링크 없는 할 일 — [원본] 버튼 비활성화
  // -------------------------------------------------------
  test('DL_S03_T34: 링크 없는 할 일의 [원본] 버튼은 비활성화 상태', async ({
    authPage,
  }) => {
    await authPage.goto('/archives');
    await authPage.waitForLoadState('networkidle');

    // 첫 번째 모음 상세 진입
    const archiveCard = authPage.getByTestId('archive-card').first();
    await archiveCard.click();
    await authPage.waitForLoadState('networkidle');

    const originalBtns = authPage.getByRole('button', { name: /원본/i });
    await expect(originalBtns.first()).toBeVisible();
    const count = await originalBtns.count();
    expect(count).toBeGreaterThan(0);

    // 각 원본 버튼의 disabled 상태 확인
    for (let i = 0; i < count; i++) {
      const btn = originalBtns.nth(i);
      const isDisabled = await btn.evaluate(
        (el) =>
          el.hasAttribute('disabled') ||
          (el as HTMLButtonElement).disabled ||
          el.getAttribute('aria-disabled') === 'true'
      );
      const hasLink = await btn.evaluate((el) => {
        const parent = el.closest('[data-has-link]');
        return parent?.getAttribute('data-has-link') === 'true';
      });
      if (!hasLink) {
        expect(isDisabled).toBe(true);
      }
    }
  });

  // -------------------------------------------------------
  // DL_S03_T36 | 할 일 편집 — 올바른 화면으로 이동
  // -------------------------------------------------------
  test('DL_S03_T36: 할 일 [편집] 버튼 클릭 시 모음 수정이 아닌 할 일 수정으로 이동', async ({
    authPage,
  }) => {
    await authPage.goto('/archives');
    await authPage.waitForLoadState('networkidle');

    const archiveCard = authPage.getByTestId('archive-card').first();
    await archiveCard.click();

    await authPage
      .getByRole('button', { name: /^편집$/i })
      .first()
      .click();
    await authPage.getByTestId('task-edit-button').first().click();

    // task/edit 으로 이동해야 한다 (archives/edit 이 아님)
    await expect(authPage).toHaveURL(/task\/edit/);
  });
});
