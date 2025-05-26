import fs from 'fs';
import path from 'path';

export function getRouteMap(viewDirPath, options = {}) {
  const routes = {};
  const files = fs.readdirSync(viewDirPath);
  const rootFile = options.root || 'HomePage';
  const notFoundFile = options.notFound || 'NotFoundPage';

  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const base = path.basename(file, '.js');

    let route;
    if (base === rootFile) {
      route = '/';
    } else if (base === notFoundFile) {
      route = '/404';
    } else {
      route = '/' + base.replace(/Page$/, '').toLowerCase();
    }

    routes[route] = base;
  }

  if (!routes['/404']) {
    routes['/404'] = notFoundFile;
  }

  return routes;
}
