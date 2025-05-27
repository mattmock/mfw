import fs from 'fs/promises';
import path from 'path';

export async function getRouteMap(viewDirPath, options = {}) {
  const routes = {};
  const files = await fs.readdir(viewDirPath);
  const rootFile = options.root || 'index';
  const notFoundFile = options.notFound || '404';

  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    const base = path.basename(file, '.html');
    const route = base === rootFile ? '/' : base === notFoundFile ? '/404' : '/' + base.toLowerCase();
    routes[route] = base;
  }

  if (!routes['/404']) {
    routes['/404'] = notFoundFile;
  }

  return routes;
}
