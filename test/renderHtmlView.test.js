// renderHtmlView.test.js
const path = require('path');
const fs = require('fs/promises');
const assert = require('assert');
const { renderHtmlView } = require('../lib/renderHtmlView');

(async () => {
  const viewName = 'testview';
  const fixturesDir = path.join(__dirname, 'fixtures');
  
  // Run render with fixtures
  const result = await renderHtmlView(viewName, {
    layoutPath: path.join(fixturesDir, 'views', 'layout.html'),
    viewsDir: fixturesDir,
    publicDir: fixturesDir,
    view: await fs.readFile(path.join(fixturesDir, 'views', 'testview.html'), 'utf-8')
  });

  // Test view injection
  assert(result.includes('<h1>Hello from view</h1>'), 'View content should be injected');
  assert(result.includes('<view-root>'), 'view-root tag should be present');
  
  // Test CSS injection
  assert(result.includes('<link tag="css" rel="stylesheet"'), 'CSS link should be properly configured');
  assert(result.includes(`href="/${fixturesDir}/css/${viewName}.css"`), 'CSS href should be correct');

  // Test JS injection
  assert(result.includes('<script tag="js"'), 'JS script tag should be present');
  assert(result.includes(`src="/${fixturesDir}/js/${viewName}.js"`), 'JS src should be correct');

  // Test basic HTML structure
  assert(result.includes('<html>'), 'HTML structure should be preserved');
  assert(result.includes('</body>'), 'HTML structure should be preserved');

  // Test partial injection
  assert(result.includes('<div class="card">'), 'Partial should be rendered as a div with card class');
  assert(result.includes('href="/partials/card/style.css"'), 'Partial CSS should be included');

  console.log('✅ renderHtmlView test passed');
})();