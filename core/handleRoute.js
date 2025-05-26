import { resolveComponent } from './resolveComponent.js';

export function handleRoute(routeMap, viewDirPath, { errorView = 'ErrorView' } = {}) {
  return async function(url) {
    try {
      const cleanUrl = url.replace(/\/+$|\/+(?=\?)/g, '') || '/';
      const viewName = routeMap[cleanUrl] || routeMap['/404'];
      return await resolveComponent(viewName, viewDirPath);
    } catch (error) {
      console.error(`[handleRoute] Error rendering ${url}:`, error);
      try {
        return await resolveComponent(errorView, viewDirPath);
      } catch (fallbackError) {
        return `<h1>Error</h1><p>${error.message}</p>`;
      }
    }
  };
}
