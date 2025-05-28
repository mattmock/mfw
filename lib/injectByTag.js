const fs = require('fs/promises');
const { parse } = require('node-html-parser');

/**
 * Injects HTML strings into elements marked with tag="..." in a partial.
 *
 * @param {string} filePath - Path to the HTML partial.
 * @param {Record<string, string>} injections - Keyed by tag name.
 * @returns {Promise<string>} - Final HTML string with content injected.
 */
async function injectByTag(filePath, injections = {}) {
  const rawHtml = await fs.readFile(filePath, 'utf-8');
  const root = parse(rawHtml);

  const seenTags = new Set();

  root.querySelectorAll('[tag]').forEach(el => {
    const tagName = el.getAttribute('tag');

    if (seenTags.has(tagName)) {
      throw new Error(`Duplicate tag="${tagName}" found in ${filePath}`);
    }
    seenTags.add(tagName);

    if (injections[tagName]) {
      el.set_content(injections[tagName]);
    }
  });

  return root.toString();
}

module.exports = { injectByTag };