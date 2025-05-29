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
 * @returns {Promise<string>} - Final HTML string with content injected.
 */
async function injectPartials(filePath, options = {}) {
  const { slots = {}, data = {} } = options;
  const rawHtml = await fs.readFile(filePath, 'utf-8');
  const root = parse(rawHtml);

  // Handle slot injections
  root.querySelectorAll('slot').forEach(slotEl => {
    const slotName = slotEl.getAttribute('name');
    if (slots[slotName]) {
      slotEl.set_content(slots[slotName]);
    } else {
      slotEl.set_content(''); // Empty string for missing slots
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

  return root.toString();
}

/**
 * Loads and injects content into a partial by tag name.
 *
 * @param {string} tagName - The partial tag to load.
 * @param {Object} options - Injection options.
 * @returns {Promise<string>} - The processed partial HTML.
 */
async function loadAndInjectPartial(tagName, options = {}) {
  const partialPath = path.join('views', 'partials', `${tagName}.html`);
  return injectPartials(partialPath, options);
}

module.exports = { injectPartials, loadAndInjectPartial }; 