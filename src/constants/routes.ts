export const ROUTES = {
  home: '/',
  folders: '/folders',
  settings: '/settings',
} as const;

export type RouteKey = keyof typeof ROUTES;

export const TAB_ROUTE_MAP = {
  home: ROUTES.home,
  folder: ROUTES.folders,
  setting: ROUTES.settings,
} as const;
