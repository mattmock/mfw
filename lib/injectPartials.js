const fs = require('fs/promises');
const { parse } = require('node-html-parser');
const path = require('path');

/**
 * Injects content into partials, supporting named slots and data attributes.
 *
 * @param {string} filePath - Path to the HTML partial.
 * @param {Object} options - Injection options.
 * @param {Record<string, string>} options.slots - Content for named slots.
 * @param {Record<string, string>} options.data - Data attributes for interpolation.
 * @returns {Promise<{html: string, cssPath: string | null}>} - Final HTML string and optional CSS path.
 */
async function injectPartials(filePath, options = {}) {
  const { slots = {}, data = {} } = options;
  const rawHtml = await fs.readFile(filePath, 'utf-8');
  const root = parse(rawHtml);

  // Handle slot injections
  root.querySelectorAll('slot').forEach(slotEl => {
    const slotName = slotEl.getAttribute('name');
    if (slots[slotName]) {
      // Parse the slot content and replace the slot element
      const slotContent = parse(slots[slotName]);
      slotEl.replaceWith(slotContent);
    } else {
      slotEl.remove(); // Remove empty slots
    }
  });

  // Handle data attribute interpolation
  root.querySelectorAll('*').forEach(el => {
    const html = el.toString();
    const interpolated = html.replace(/{{ data-([^}]+) }}/g, (match, attr) => {
      return data[attr] || '';
    });
    if (html !== interpolated) {
      el.replaceWith(parse(interpolated));
    }
  });

  // Check for matching CSS file
  const cssPath = filePath.replace('index.html', 'style.css');
  let cssExists = false;
  try {
    await fs.access(cssPath);
    cssExists = true;
  } catch {
    // CSS file doesn't exist, that's okay
  }

  // Convert file system path to web-relative path
  const webCssPath = cssExists 
    ? `/partials/${path.basename(path.dirname(filePath))}/style.css`
    : null;

  return {
    html: root.toString(),
    cssPath: webCssPath
  };
}

/**
 * Loads and injects content into a partial by tag name.
 *
 * @param {string} tagName - The partial tag to load.
 * @param {Object} options - Injection options.
 * @returns {Promise<{html: string, cssPath: string | null}>} - The processed partial HTML and optional CSS path.
 */
async function loadAndInjectPartial(tagName, options = {}) {
  const partialPath = path.join('views', 'partials', tagName, 'index.html');
  return injectPartials(partialPath, options);
}

module.exports = { injectPartials, loadAndInjectPartial }; 