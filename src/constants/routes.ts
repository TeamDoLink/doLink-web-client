export const ROUTES = {
  home: '/',
  archives: '/archives',
  settings: '/settings',
  test: '/test',
  test2: '/test2',
} as const;

export const TAB_ROUTE_MAP = {
  home: ROUTES.home,
  archive: ROUTES.archives,
  setting: ROUTES.settings,
} as const;

export type RouteKey = keyof typeof ROUTES;
