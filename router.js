import fs from 'fs';
import path from 'path';
import { resolveComponent } from './helpers.js';

/**
 * Automatically maps view files to route paths.
 * Allows configurable root and 404 view names.
 */
export function defineFileRoutes(viewDirPath, options = {}) {
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

  return async function(req, res) {
    const cleanPath = req.path.replace(/\/+$/, '') || '/';
    const viewName = routes[cleanPath] || routes['/404'];
    try {
      const html = await resolveComponent(viewName, viewDirPath);
      res.send(html);
    } catch (err) {
      console.error('[Router Error]', err);
      res.status(500).send('Internal Server Error');
    }
  };
}
