const fs = require('fs/promises');
const { parse } = require('node-html-parser');
const path = require('path');

/**
 * Validates partial nesting rules
 * @param {string} parentType - Type of parent partial ('view', 'struct', or 'part')
 * @param {string} childType - Type of child partial ('struct' or 'part')
 * @throws {Error} If nesting is invalid
 */
function validateNesting(parentType, childType) {
  if (parentType === 'part') {
    throw new Error('Parts cannot contain other partials');
  }
  if (parentType === 'struct' && childType === 'struct') {
    throw new Error('Structs cannot contain other structs');
  }
  if (parentType === 'struct' && childType !== 'part') {
    throw new Error('Structs can only contain parts');
  }
}

/**
 * Resolves the path to a partial based on its type and name
 * @param {string} name - Name of the partial
 * @param {string} type - Type of partial ('struct' or 'part')
 * @param {string} viewsDir - Base directory for views
 * @returns {Object} Paths to HTML and CSS files
 */
function resolvePartial(name, type, viewsDir) {
  // Get the parent directory of views (where structs and parts live)
  const baseDir = path.dirname(viewsDir);
  const basePath = type === 'struct' ? 'structs' : 'parts';
  const partialPath = path.join(baseDir, basePath, name);
  
  return {
    html: path.join(partialPath, `${name}.html`),
    css: path.join(partialPath, `${name}.css`)
  };
}

/**
 * Injects content into partials.
 *
 * @param {string} filePath - Path to the HTML partial.
 * @param {Object} options - Injection options.
 * @param {string} options.type - Type of partial ('struct' or 'part')
 * @param {string} options.publicDir - Base public directory
 * @returns {Promise<{html: string, cssPath: string | null}>} - Final HTML string and optional CSS path.
 */
async function injectPartials(filePath, options = {}) {
  const { type, publicDir = 'public' } = options;
  
  // Validate partial type
  if (!type) {
    throw new Error('Partial type must be specified');
  }
  if (!['struct', 'part'].includes(type)) {
    throw new Error(`Invalid partial type: ${type}`);
  }

  // Validate file exists
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Partial file not found: ${filePath}`);
  }

  const rawHtml = await fs.readFile(filePath, 'utf-8');
  const root = parse(rawHtml);

  // Check for matching CSS file
  const cssPath = filePath.replace('.html', '.css');
  let cssExists = false;
  try {
    await fs.access(cssPath);
    cssExists = true;
  } catch {
    // CSS file doesn't exist, that's okay
  }

  // Convert file system path to web-relative path
  const webCssPath = cssExists 
    ? `/css/${path.basename(cssPath)}`
    : null;

  return {
    html: root.toString(),
    cssPath: webCssPath
  };
}

/**
 * Loads and injects content into a partial by name and type.
 *
 * @param {string} name - The partial name to load.
 * @param {Object} options - Injection options.
 * @param {string} options.type - Type of partial ('struct' or 'part')
 * @param {string} options.viewsDir - Base directory for views
 * @param {string} options.publicDir - Base public directory
 * @returns {Promise<{html: string, cssPath: string | null}>} - The processed partial HTML and optional CSS path.
 */
async function loadAndInjectPartial(name, options = {}) {
  const { type, viewsDir = 'views', publicDir = 'public' } = options;
  
  if (!type) {
    throw new Error('Partial type must be specified');
  }

  const { html: partialPath, css: cssPath } = resolvePartial(name, type, viewsDir);
  
  try {
    return await injectPartials(partialPath, {
      type,
      publicDir
    });
  } catch (error) {
    throw new Error(`Failed to load partial ${name}: ${error.message}`);
  }
}

module.exports = { 
  injectPartials, 
  loadAndInjectPartial,
  validateNesting,
  resolvePartial
}; 