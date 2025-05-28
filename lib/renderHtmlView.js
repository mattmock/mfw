const fs = require('fs/promises');
const path = require('path');

/**
 * Renders a complete HTML page using a layout, injecting view HTML, CSS, and JS if available.
 *
 * @param {string} viewName - Base name of the view (e.g., 'todo' → views/todo.html).
 * @param {Object} options - Optional overrides for {{ view }}, {{ cssPath }}, {{ jsPath }}.
 * @returns {Promise<string>} - Final rendered HTML.
 */
async function renderHtmlView(viewName, options = {}) {
  const layoutPath = path.join('views', 'layout.html');
  const viewPath = path.join('views', `${viewName}.html`);

  const layout = await fs.readFile(layoutPath, 'utf-8');
  const viewHtml = options.view || await fs.readFile(viewPath, 'utf-8');

  let cssPath = '';
  let jsPath = '';

  try {
    await fs.access(path.join('public/css', `${viewName}.css`));
    cssPath = `<link rel="stylesheet" href="/public/css/${viewName}.css">`;
  } catch {}

  try {
    await fs.access(path.join('public/js', `${viewName}.js`));
    jsPath = `<script src="/public/js/${viewName}.js"></script>`;
  } catch {}

  return layout
    .replace('{{ view }}', viewHtml)
    .replace('{{ cssPath }}', cssPath)
    .replace('{{ jsPath }}', jsPath);
}

module.exports = { renderHtmlView };