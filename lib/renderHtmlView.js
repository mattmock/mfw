const fs = require('fs/promises');
const path = require('path');
const { parse } = require('node-html-parser');
const { loadAndInjectPartial } = require('./injectPartials');

/**
 * Renders a complete HTML page using a layout, injecting view HTML, CSS, and JS if available.
 *
 * @param {string} viewName - Base name of the view (e.g., 'todo' → views/todo.html).
 * @param {Object} options - Optional overrides for view content, CSS, and JS paths.
 * @param {string} options.layoutPath - Path to layout file (default: 'views/layout.html')
 * @param {string} options.viewsDir - Directory containing view files (default: 'views')
 * @param {string} options.publicDir - Directory containing static files (default: 'public')
 * @returns {Promise<string>} - Final rendered HTML.
 */
async function renderHtmlView(viewName, options = {}) {
  const {
    layoutPath = path.join('views', 'layout.html'),
    viewsDir = 'views',
    publicDir = 'public',
    view
  } = options;

  const viewPath = path.join(viewsDir, `${viewName}.html`);

  // Load layout and parse into DOM
  const layout = await fs.readFile(layoutPath, 'utf-8');
  const root = parse(layout);
  
  // Get view content
  const viewHtml = view || await fs.readFile(viewPath, 'utf-8');
  const viewRoot = parse(viewHtml);
  
  // Process partials in the view
  const partialPromises = [];
  const cssPaths = new Set(); // Track unique CSS paths

  viewRoot.querySelectorAll('partial').forEach(partial => {
    const tag = partial.getAttribute('tag');
    if (!tag) return;

    // Extract slots
    const slots = {};
    partial.querySelectorAll('[slot]').forEach(slot => {
      const slotName = slot.getAttribute('slot');
      slots[slotName] = slot.toString();
    });

    // Extract data attributes
    const data = {};
    const attrs = partial.rawAttrs;
    const dataAttrRegex = /data-([^=]+)="([^"]+)"/g;
    let match;
    while ((match = dataAttrRegex.exec(attrs)) !== null) {
      data[match[1]] = match[2];
    }

    // Queue partial injection
    partialPromises.push(
      loadAndInjectPartial(tag, { slots, data })
        .then(({ html, cssPath }) => {
          partial.replaceWith(parse(html));
          if (cssPath) {
            cssPaths.add(cssPath);
          }
        })
    );
  });

  // Wait for all partials to be processed
  await Promise.all(partialPromises);
  
  // Inject processed view content
  const viewRootEl = root.querySelector('view-root');
  if (viewRootEl) {
    viewRootEl.innerHTML = viewRoot.toString();
  }

  // Handle CSS injection
  const cssLink = root.querySelector('link[tag="css"]');
  if (cssLink) {
    // Add view CSS if it exists
    try {
      await fs.access(path.join(publicDir, 'css', `${viewName}.css`));
      cssPaths.add(`/public/css/${viewName}.css`);
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

  // Handle JS injection
  const jsScript = root.querySelector('script[tag="js"]');
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