const fs = require('fs/promises');
const { parse } = require('node-html-parser');
const path = require('path');
const { validateNesting, loadAndInjectPartial } = require('./injectPartials');

// Cache for partial content
const partialCache = new Map();

/**
 * Clears the partial cache
 */
function clearCache() {
  partialCache.clear();
}

/**
 * Gets a cache key for a partial
 * @param {string} name - Partial name
 * @param {string} type - Partial type
 * @returns {string} Cache key
 */
function getCacheKey(name, type) {
  return `${type}:${name}`;
}

/**
 * Injects content into structs and parts based on their name attributes.
 * This is the new name-based injection system that replaces the old tag system.
 *
 * @param {string} filePathOrHtml - Path to the HTML partial or HTML content string
 * @param {Object} options - Additional options
 * @param {string} options.type - Type of partial ('view', 'struct', or 'part')
 * @param {string} options.viewsDir - Base directory for views
 * @param {string} options.publicDir - Base directory for public files
 * @returns {Promise<{html: string, cssPaths: Set<string>}>} - Final HTML string and CSS paths
 */
async function injectByName(filePathOrHtml, options = {}) {
  const { 
    type = 'view',
    viewsDir = 'views',
    publicDir = 'public'
  } = options;

  // Parse HTML content
  let root;
  if (filePathOrHtml.startsWith('<')) {
    // It's HTML content
    root = parse(filePathOrHtml);
  } else {
    // It's a file path
    try {
      await fs.access(filePathOrHtml);
      const rawHtml = await fs.readFile(filePathOrHtml, 'utf-8');
      root = parse(rawHtml);
    } catch {
      throw new Error(`File not found: ${filePathOrHtml}`);
    }
  }

  const cssPaths = new Set();

  // Process structs
  const structPromises = [];
  root.querySelectorAll('struct').forEach(struct => {
    const structName = struct.getAttribute('name');
    if (!structName) {
      throw new Error(`Struct missing name attribute in ${filePathOrHtml}`);
    }

    // Validate struct nesting
    validateNesting(type, 'struct');

    // Check cache
    const cacheKey = getCacheKey(structName, 'struct');
    if (partialCache.has(cacheKey)) {
      const { html, cssPath } = partialCache.get(cacheKey);
      struct.replaceWith(parse(html));
      if (cssPath) cssPaths.add(cssPath);
      return;
    }

    // Queue struct injection
    structPromises.push(
      loadAndInjectPartial(structName, {
        type: 'struct',
        viewsDir,
        publicDir
      }).then(({ html, cssPath }) => {
        // Cache result
        partialCache.set(cacheKey, { html, cssPath });
        
        // Update DOM with struct content
        const structContent = parse(html);
        struct.replaceWith(structContent);
        if (cssPath) cssPaths.add(cssPath);

        // Now process parts within the struct content
        const partPromises = [];
        structContent.querySelectorAll('part').forEach(part => {
          const partName = part.getAttribute('name');
          if (!partName) {
            throw new Error(`Part missing name attribute in struct ${structName}`);
          }

          // Validate part nesting
          validateNesting('struct', 'part');

          // Check cache
          const partCacheKey = getCacheKey(partName, 'part');
          if (partialCache.has(partCacheKey)) {
            const { html, cssPath } = partialCache.get(partCacheKey);
            part.replaceWith(parse(html));
            if (cssPath) cssPaths.add(cssPath);
            return;
          }

          // Queue part injection
          partPromises.push(
            loadAndInjectPartial(partName, {
              type: 'part',
              viewsDir,
              publicDir
            }).then(({ html, cssPath }) => {
              // Cache result
              partialCache.set(partCacheKey, { html, cssPath });
              
              // Update DOM
              part.replaceWith(parse(html));
              if (cssPath) cssPaths.add(cssPath);
            })
          );
        });

        return Promise.all(partPromises);
      })
    );
  });

  // Process parts directly in the view
  const viewPartPromises = [];
  root.querySelectorAll('part').forEach(part => {
    const partName = part.getAttribute('name');
    if (!partName) {
      throw new Error(`Part missing name attribute in ${filePathOrHtml}`);
    }

    // Validate part nesting
    validateNesting(type, 'part');

    // Check cache
    const partCacheKey = getCacheKey(partName, 'part');
    if (partialCache.has(partCacheKey)) {
      const { html, cssPath } = partialCache.get(partCacheKey);
      part.replaceWith(parse(html));
      if (cssPath) cssPaths.add(cssPath);
      return;
    }

    // Queue part injection
    viewPartPromises.push(
      loadAndInjectPartial(partName, {
        type: 'part',
        viewsDir,
        publicDir
      }).then(({ html, cssPath }) => {
        // Cache result
        partialCache.set(partCacheKey, { html, cssPath });
        
        // Update DOM
        part.replaceWith(parse(html));
        if (cssPath) cssPaths.add(cssPath);
      })
    );
  });

  // Wait for all partials to be processed
  await Promise.all([...structPromises, ...viewPartPromises]);

  return {
    html: root.toString(),
    cssPaths
  };
}

module.exports = { 
  injectByName,
  clearCache
}; 