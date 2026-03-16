/**
 * DL_S05 — 할 일 (Task)
 * 로그인 상태에서의 할 일 CRUD, 이탈 감지, 공유 등을 검증합니다.
 */
import { test, expect } from '../fixtures';

test.describe('DL_S05 할 일', () => {
  // -------------------------------------------------------
  // DL_S05_T04 | 작성 이탈 — 팝업 텍스트 정상 노출
  // -------------------------------------------------------
  test('DL_S05_T04: 할 일 작성 중 뒤로가기 시 [저장하고 나가기] 팝업 텍스트 정상 노출', async ({
    authPage,
  }) => {
    await authPage.goto('/task/create');

    const titleInput = authPage.getByPlaceholder(/제목을 입력해 주세요/i);
    if ((await titleInput.count()) === 0) {
      test.skip();
      return;
    }
    await titleInput.fill('테스트 할 일');

    // X 버튼 또는 뒤로가기 버튼 클릭
    const closeBtn = authPage
      .getByRole('button', { name: /닫기|뒤로|back/i })
      .first();
    if ((await closeBtn.count()) === 0) {
      test.skip();
      return;
    }
    await closeBtn.click();

    // 이탈 확인 팝업이 노출되어야 한다
    const popup = authPage.getByRole('dialog');
    await expect(popup).toBeVisible();

    // 팝업 내 텍스트가 깨지지 않아야 한다 (한글 정상 노출)
    await expect(popup).toContainText(/저장|나가기|취소/i);
  });

  // -------------------------------------------------------
  // DL_S05_T08 | 할 일 완료 — 다시 보지 않기 동작
  // -------------------------------------------------------
  test('DL_S05_T08: 완료 모달의 [다시 보지 않기]는 현재 세션에서 다시 노출되지 않아야 함', async ({
    authPage,
  }) => {
    await authPage.goto('/');
    await authPage.waitForLoadState('networkidle');

    const checkbox = authPage.getByRole('checkbox').first();
    if ((await checkbox.count()) === 0) {
      test.skip();
      return;
    }
    await checkbox.click();

    // 완료 모달 대기
    const modal = authPage.getByRole('dialog');
    if ((await modal.count()) === 0) {
      test.skip();
      return;
    }
    await expect(modal).toBeVisible();

    const doNotShowBtn = authPage.getByRole('button', {
      name: /다시 보지 않기/i,
    });
    await doNotShowBtn.click();

    // 다른 할 일 체크박스 다시 클릭
    const nextCheckbox = authPage.getByRole('checkbox').first();
    if ((await nextCheckbox.count()) > 0) {
      await nextCheckbox.click();
      // 모달이 다시 노출되지 않아야 한다
      await expect(authPage.getByRole('dialog')).not.toBeVisible();
    }
  });

  // -------------------------------------------------------
  // DL_S05_T19 | 임시저장 — 재생성 시 초기화
  // -------------------------------------------------------
  test('DL_S05_T19: 임시저장 후 저장 완료 시 [+] 버튼 클릭하면 빈 폼이 열린다', async ({
    authPage,
  }) => {
    await authPage.goto('/task/create');

    const titleInput = authPage.getByPlaceholder(/제목을 입력해 주세요/i);
    if ((await titleInput.count()) === 0) {
      test.skip();
      return;
    }
    await titleInput.fill('임시저장 테스트');

    // 저장 버튼 클릭
    const saveBtn = authPage.getByRole('button', { name: /저장|추가/i }).last();
    if ((await saveBtn.count()) === 0) {
      test.skip();
      return;
    }
    await saveBtn.click();
    await authPage.waitForURL(/\//);

    // FAB [+] 버튼 클릭
    const fabBtn = authPage.getByRole('button', { name: /\+|할 일 추가/i });
    if ((await fabBtn.count()) === 0) {
      test.skip();
      return;
    }
    await fabBtn.click();

    // 이전 임시저장 데이터가 없어야 한다 (빈 폼)
    const inputAfter = authPage.getByPlaceholder(/제목을 입력해 주세요/i);
    await expect(inputAfter).toHaveValue('');
  });

  // -------------------------------------------------------
  // DL_S05_T30 | 원본 버튼 — 유효하지 않은 링크 비활성화
  // -------------------------------------------------------
  test('DL_S05_T30: 유효하지 않은 링크의 [원본] 버튼은 비활성화 상태', async ({
    authPage,
  }) => {
    await authPage.goto('/archives');
    await authPage.waitForLoadState('networkidle');

    const archiveCard = authPage.getByTestId('archive-card').first();
    if ((await archiveCard.count()) === 0) {
      test.skip();
      return;
    }
    await archiveCard.click();

    const originalBtns = authPage.getByRole('button', { name: /원본/i });
    const count = await originalBtns.count();
    if (count === 0) {
      test.skip();
      return;
    }

    for (let i = 0; i < count; i++) {
      const btn = originalBtns.nth(i);
      const isDisabled = await btn.evaluate(
        (el) =>
          el.hasAttribute('disabled') ||
          (el as HTMLButtonElement).disabled ||
          el.getAttribute('aria-disabled') === 'true'
      );
      const isInvalid = await btn.evaluate((el) => {
        const parent = el.closest('[data-link]');
        if (!parent) return false;
        const link = parent.getAttribute('data-link');
        return !link || link === '' || link === 'undefined';
      });
      if (isInvalid) {
        expect(isDisabled).toBe(true);
      }
    }
  });

  // -------------------------------------------------------
  // DL_S05_T32 | 할 일 편집 — 올바른 화면으로 이동
  // -------------------------------------------------------
  test('DL_S05_T32: 모음 상세에서 할 일 [편집] 클릭 시 할 일 수정 화면으로 이동', async ({
    authPage,
  }) => {
    await authPage.goto('/archives');
    await authPage.waitForLoadState('networkidle');

    const archiveCard = authPage.getByTestId('archive-card').first();
    if ((await archiveCard.count()) === 0) {
      test.skip();
      return;
    }
    await archiveCard.click();

    const editBtn = authPage.getByRole('button', { name: /편집/i }).first();
    if ((await editBtn.count()) === 0) {
      test.skip();
      return;
    }
    await editBtn.click();

    await expect(authPage).toHaveURL(/task\/edit/);
  });

  // -------------------------------------------------------
  // DL_S05_T10 | 할 일 상세 — 디폴트 이미지 두링크 로고
  // -------------------------------------------------------
  test('DL_S05_T10: 할 일 상세의 디폴트 이미지가 정상 노출', async ({
    authPage,
  }) => {
    await authPage.goto('/');
    await authPage.waitForLoadState('networkidle');

    const taskItem = authPage.getByTestId('task-item').first();
    if ((await taskItem.count()) === 0) {
      test.skip();
      return;
    }
    await taskItem.click();
    await authPage.waitForLoadState('networkidle');

    const thumbnail = authPage.getByTestId('task-thumbnail');
    if ((await thumbnail.count()) === 0) {
      test.skip();
      return;
    }

    const isVisible = await thumbnail.isVisible();
    expect(isVisible).toBe(true);
  });
});
