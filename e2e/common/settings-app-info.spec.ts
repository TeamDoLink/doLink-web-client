import { test, expect } from '../fixtures';

test.describe('설정 - 앱 정보 표시', () => {
  test('앱에서 받은 version/runtimeVersion을 표시한다', async ({
    authPage,
  }) => {
    await authPage.goto('/settings');

    await expect(authPage.getByTestId('settings-app-version')).toContainText(
      '9.9.9-test'
    );
    await expect(
      authPage.getByTestId('settings-runtime-version')
    ).toContainText('9.9.9-runtime');
  });
});
