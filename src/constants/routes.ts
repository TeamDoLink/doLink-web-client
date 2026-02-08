export const ROUTES = {
  home: '/',
  archives: '/archives',
  archiveAdd: '/archives/add',
  archiveEdit: '/archives/edit',
  archiveDetail: '/archives/detail',
  archiveTutorial: '/archives/tutorial',
  settings: '/settings',
  settingsWithdrawal: '/settings/withdrawal',
  settingsWithdrawalConfirm: '/settings/withdrawal/confirm',
  taskDetail: '/task/detail',
  test: '/test',
  test2: '/test2',
  test3: '/test3',
  taskCreate: '/task/create',
  login: '/login',
  linkTest: '/link-test',
  shareIntent: '/share-intent',
} as const;

export const TAB_ROUTE_MAP = {
  home: ROUTES.home,
  archive: ROUTES.archives,
  setting: ROUTES.settings,
} as const;

export type RouteKey = keyof typeof ROUTES;
