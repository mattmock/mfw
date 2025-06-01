const fs = require('fs/promises');
const path = require('path');
const { parse } = require('node-html-parser');
const { injectByName } = require('./injectByName');

/**
 * Renders a complete HTML page using a layout, injecting view HTML, CSS, and JS if available.
 *
 * @param {string} viewName - Base name of the view (e.g., 'todo' → views/todo.html).
 * @param {Object} options - Optional overrides for view content, CSS, and JS paths.
 * @param {string} options.appPath - Path to layout file (default: 'app.html')
 * @param {string} options.viewsDir - Directory containing view files (default: 'views')
 * @param {string} options.publicDir - Directory containing static files (default: 'public')
 * @returns {Promise<string>} - Final rendered HTML.
 */
async function renderHtmlView(viewName, options = {}) {
  const {
    appPath = 'app.html',
    viewsDir = 'views',
    publicDir = 'public',
    view
  } = options;

  const viewPath = path.join(viewsDir, `${viewName}.html`);

  // Load layout and parse into DOM
  const app = await fs.readFile(appPath, 'utf-8');
  const root = parse(app);
  
  // Get view content
  const viewHtml = view || await fs.readFile(viewPath, 'utf-8');
  
  // Process view using injectByName
  const { html: processedView, cssPaths } = await injectByName(viewHtml, {
    type: 'view',
    viewsDir,
    publicDir,
    data: {} // View-level data can be added here
  });

  // Inject processed view content
  const viewRootEl = root.querySelector('view-root');
  if (viewRootEl) {
    // Parse the processed view to get its content
    const processedRoot = parse(processedView);
    const processedViewRoot = processedRoot.querySelector('view-root');
    if (processedViewRoot) {
      // Replace the view-root content with the processed content
      viewRootEl.innerHTML = processedViewRoot.innerHTML;
    }
  }

  // Handle CSS injection
  const cssLink = root.querySelector('link[rel="stylesheet"]');
  if (cssLink) {
    // Add view CSS if it exists
    try {
      await fs.access(path.join(publicDir, 'css', `${viewName}.css`));
      cssPaths.add(`/css/${viewName}.css`);
    } catch {
      // No view CSS, that's okay
    }

    // Replace single CSS link with multiple links
    if (cssPaths.size > 0) {
      const cssLinks = Array.from(cssPaths).map(cssPath => {
        return `<link rel="stylesheet" href="${cssPath}">`;
      }).join('\n');
      cssLink.replaceWith(parse(cssLinks));
    } else {
      cssLink.remove();
    }
  }

  // Handle JS injection (only for views, not structs or parts)
  const jsScript = root.querySelector('script[src]');
  if (jsScript) {
    try {
      await fs.access(path.join(publicDir, 'js', `${viewName}.js`));
      jsScript.setAttribute('src', `/${publicDir}/js/${viewName}.js`);
    } catch {
      jsScript.remove(); // Remove if no JS file exists
    }
  }

  return root.toString();
}

module.exports = { renderHtmlView };