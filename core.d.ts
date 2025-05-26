export function getRouteMap(
  viewDirPath: string,
  options?: {
    root?: string;
    notFound?: string;
  }
): Record<string, string>;

export function handleRoute(
  routeMap: Record<string, string>,
  viewDirPath: string
): (url: string) => Promise<string>;

export function resolveComponent(
  name: string,
  viewDirPath: string
): Promise<string>;

export function store<T>(
  initial: T
): {
  get: () => T;
  set: (value: T) => void;
  update: (fn: (value: T) => T) => void;
  subscribe: (fn: (value: T) => void) => () => void;
};

export const MFW: {
  getRouteMap: typeof getRouteMap;
  handleRoute: typeof handleRoute;
  resolveComponent: typeof resolveComponent;
  store: typeof store;
};
