const fs = require('fs/promises');
const path = require('path');
const { parse } = require('node-html-parser');

/**
 * Renders a complete HTML page using a layout, injecting view HTML, CSS, and JS if available.
 *
 * @param {string} viewName - Base name of the view (e.g., 'todo' → views/todo.html).
 * @param {Object} options - Optional overrides for view content, CSS, and JS paths.
 * @returns {Promise<string>} - Final rendered HTML.
 */
async function renderHtmlView(viewName, options = {}) {
  const layoutPath = path.join('views', 'layout.html');
  const viewPath = path.join('views', `${viewName}.html`);

  // Load layout and parse into DOM
  const layout = await fs.readFile(layoutPath, 'utf-8');
  const root = parse(layout);
  
  // Get view content
  const viewHtml = options.view || await fs.readFile(viewPath, 'utf-8');
  
  // Inject view content
  const viewRoot = root.querySelector('view-root');
  if (viewRoot) {
    viewRoot.innerHTML = viewHtml;
  }

  // Handle CSS injection
  const cssLink = root.querySelector('link[tag="css"]');
  if (cssLink) {
    try {
      await fs.access(path.join('public/css', `${viewName}.css`));
      cssLink.setAttribute('rel', 'stylesheet');
      cssLink.setAttribute('href', `/public/css/${viewName}.css`);
    } catch {
      cssLink.remove(); // Remove if no CSS file exists
    }
  }

  // Handle JS injection
  const jsScript = root.querySelector('script[tag="js"]');
  if (jsScript) {
    try {
      await fs.access(path.join('public/js', `${viewName}.js`));
      jsScript.setAttribute('src', `/public/js/${viewName}.js`);
    } catch {
      jsScript.remove(); // Remove if no JS file exists
    }
  }

  return root.toString();
}

module.exports = { renderHtmlView };