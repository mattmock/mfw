import { resolveHtmlView } from './resolveHtmlView.js';

export function handleRoute(routeMap, viewDirPath, { props = {}, errorView = 'error', componentDirPath } = {}) {
  return async function(url) {
    const cleanUrl = url.replace(/\/+$|\/+(?=\?)/g, '') || '/';
    const viewName = routeMap[cleanUrl] || routeMap['/404'];
    try {
      return await resolveHtmlView(viewName, viewDirPath, props, componentDirPath);
    } catch (err) {
      console.error('[handleRoute] View failed:', err);
      try {
        return await resolveHtmlView(errorView, viewDirPath, { error: err.message }, componentDirPath);
      } catch (fallbackErr) {
        console.error('[handleRoute] Error view failed:', fallbackErr);
        return \`<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body>
<h1>Something went wrong</h1>
<p>\${err.message}</p>
</body>
</html>\`;
      }
    }
  };
}
