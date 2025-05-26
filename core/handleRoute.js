import { resolveComponent } from './resolveComponent.js';

export function handleRoute(routeMap, viewDirPath) {
  return async function(url) {
    const cleanUrl = url.replace(/\/+$|\/+(?=\?)/g, '') || '/';
    const viewName = routeMap[cleanUrl] || routeMap['/404'];
    return await resolveComponent(viewName, viewDirPath);
  };
}
