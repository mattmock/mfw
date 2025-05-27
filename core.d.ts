export function getRouteMap(
  viewDirPath: string,
  options?: {
    root?: string;
    notFound?: string;
  }
): Promise<Record<string, string>>;

export function handleRoute(
  routeMap: Record<string, string>,
  viewDirPath: string,
  options?: {
    props?: Record<string, unknown>;
    errorView?: string;
    componentDirPath?: string;
  }
): (url: string) => Promise<string>;

export function resolveHtmlView(
  name: string,
  viewDirPath: string,
  props?: Record<string, unknown>,
  componentDirPath?: string
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
  resolveHtmlView: typeof resolveHtmlView;
  store: typeof store;
};
