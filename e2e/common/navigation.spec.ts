/**
 * 공통 — 라우팅 / 네비게이션
 * 인증 여부와 무관하게 동작해야 하는 화면 이동을 검증합니다.
 */
import { test, expect } from '../fixtures';

test.describe('공통 — 네비게이션', () => {
  test('홈(/) 접근 가능', async ({ guestPage }) => {
    await guestPage.goto('/');
    await expect(guestPage).toHaveURL('/');
  });

  test('로그인(/login) 페이지 접근 가능', async ({ guestPage }) => {
    await guestPage.goto('/login');
    await expect(guestPage).toHaveURL('/login');
    await expect(
      guestPage.getByText(/SNS 계정으로 간편 가입하기/i)
    ).toBeVisible();
  });

  test('검색(/search) 페이지 접근 가능', async ({ guestPage }) => {
    await guestPage.goto('/search');
    await expect(guestPage).toHaveURL('/search');
  });

  test('설정(/settings) 페이지 접근 가능', async ({ guestPage }) => {
    await guestPage.goto('/settings');
    await expect(guestPage).toHaveURL('/settings');
  });

  test('회원탈퇴(/settings/withdrawal) 페이지 접근 가능', async ({
    guestPage,
  }) => {
    await guestPage.goto('/settings/withdrawal');
    await expect(guestPage).toHaveURL('/settings/withdrawal');
  });

  test('모음 목록(/archives) 접근 가능', async ({ guestPage }) => {
    await guestPage.goto('/archives');
    await expect(guestPage).toHaveURL('/archives');
  });

  test('모음 추가(/archives/add) 접근 가능', async ({ guestPage }) => {
    await guestPage.goto('/archives/add');
    await expect(guestPage).toHaveURL('/archives/add');
  });

  test('할 일 생성(/task/create) 접근 가능', async ({ guestPage }) => {
    await guestPage.goto('/task/create');
    await expect(guestPage).toHaveURL('/task/create');
  });
});
