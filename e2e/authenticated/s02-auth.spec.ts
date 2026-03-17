/**
 * DL_S02 — 로그인 / 설정
 * 인증 상태에서의 설정 화면 및 회원탈퇴 플로우를 검증합니다.
 */
import { test, expect } from '../fixtures';

test.describe('DL_S02 로그인 / 설정', () => {
  // -------------------------------------------------------
  // DL_S02_T03 | 개인화 메시지 — 최초 로그인 사용자
  // -------------------------------------------------------
  test('DL_S02_T03: 홈화면 상단 개인화 메시지가 노출된다', async ({
    authPage,
  }) => {
    await authPage.goto('/');
    await authPage.waitForLoadState('networkidle');

    const greeting = authPage.getByTestId('personalized-message');
    await expect(greeting).toBeVisible();
  });

  // -------------------------------------------------------
  // DL_S02_T05 | 설정 — 프로필 이미지 정상 노출
  // -------------------------------------------------------
  test('DL_S02_T05: 설정 화면에서 프로필 이미지가 깨지지 않고 노출', async ({
    authPage,
  }) => {
    await authPage.goto('/settings');
    await authPage.waitForLoadState('networkidle');

    const profileImg = authPage.getByRole('img', { name: /프로필/i });
    // 이미지가 정상적으로 로드됐는지 확인 (naturalWidth > 0)
    const isLoaded = await profileImg.evaluate(
      (el) => (el as HTMLImageElement).naturalWidth > 0
    );
    expect(isLoaded).toBe(true);
  });

  // -------------------------------------------------------
  // DL_S02_T07 | 설정 — 회원탈퇴 버튼 한 줄 표시
  // -------------------------------------------------------
  test('DL_S02_T07: 설정 화면 [회원탈퇴] 버튼 텍스트가 두 줄로 개행되지 않는다', async ({
    authPage,
  }) => {
    await authPage.goto('/settings');

    const withdrawBtn = authPage.getByRole('button', { name: /회원탈퇴/i });
    await expect(withdrawBtn).toBeVisible();

    // Range.getClientRects()로 실제 텍스트 줄 수를 측정
    // 텍스트가 개행되면 rect가 2개 이상 반환됨
    const lineCount = await withdrawBtn.evaluate((el) => {
      const range = document.createRange();
      const textNode =
        Array.from(el.childNodes).find((n) => n.nodeType === Node.TEXT_NODE) ??
        el.firstChild ??
        el;
      range.selectNodeContents(textNode as Node);
      return range.getClientRects().length;
    });
    expect(lineCount).toBe(1);
  });

  // -------------------------------------------------------
  // DL_S02_T08 | 회원탈퇴 의견보내기 — CTA 버튼 상태
  // -------------------------------------------------------
  test('DL_S02_T08: 기타 선택 후 사유 미입력 시 [의견보내기] 버튼 비활성화', async ({
    authPage,
  }) => {
    await authPage.goto('/settings/withdrawal');

    // '기타' 옵션 선택
    const etcOption = authPage.getByRole('radio', { name: /기타/i });
    await etcOption.click();

    const sendBtn = authPage.getByTestId('submit-button');
    await expect(sendBtn).toBeDisabled();
  });

  // -------------------------------------------------------
  // DL_S02_T08 | 회원탈퇴 의견보내기 — 버튼 한 줄 표시
  // -------------------------------------------------------
  test('DL_S02_T08: [의견보내기] 버튼 텍스트가 두 줄로 개행되지 않는다', async ({
    authPage,
  }) => {
    await authPage.goto('/settings/withdrawal');

    const sendBtn = authPage.getByTestId('submit-button');
    await expect(sendBtn).toBeVisible();

    const lineCount = await sendBtn.evaluate((el) => {
      const range = document.createRange();
      const textNode =
        Array.from(el.childNodes).find((n) => n.nodeType === Node.TEXT_NODE) ??
        el.firstChild ??
        el;
      range.selectNodeContents(textNode as Node);
      return range.getClientRects().length;
    });
    expect(lineCount).toBe(1);
  });
});
