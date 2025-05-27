import { resolveHtmlView } from './resolveHtmlView.js';

export function handleRoute(routeMap, viewDirPath, { props = {}, errorView = 'error' } = {}) {
  return async function(url) {
    const cleanUrl = url.replace(/\/+$|\/+(?=\?)/g, '') || '/';
    const viewName = routeMap[cleanUrl] || routeMap['/404'];
    try {
      return await resolveHtmlView(viewName, viewDirPath, props);
    } catch (err) {
      console.error('[handleRoute] View failed:', err);
      try {
        return await resolveHtmlView(errorView, viewDirPath, { error: err.message });
      } catch (fallbackErr) {
        console.error('[handleRoute] Error view failed:', fallbackErr);
        return `
          <!DOCTYPE html>
          <html>
            <head><title>Error</title></head>
            <body>
              <h1>Something went wrong</h1>
              <p>${err.message}</p>
            </body>
          </html>
        `;
      }
    }
  };
}
