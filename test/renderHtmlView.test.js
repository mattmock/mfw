// renderHtmlView.test.js
const path = require('path');
const fs = require('fs/promises');
const assert = require('assert');
const { renderHtmlView } = require('../lib/renderHtmlView');

(async () => {
  const viewName = 'testview';
  const fixturesDir = path.join(__dirname, 'fixtures');
  
  // Create necessary directories for test files
  await fs.mkdir(path.join('public', 'css'), { recursive: true });
  await fs.mkdir(path.join('public', 'js'), { recursive: true });
  
  // Copy test files to public directory
  await fs.copyFile(
    path.join(fixturesDir, 'testview.css'),
    path.join('public', 'css', 'testview.css')
  );
  await fs.copyFile(
    path.join(fixturesDir, 'testview.js'),
    path.join('public', 'js', 'testview.js')
  );

  // Run render
  const result = await renderHtmlView(viewName, {
    view: await fs.readFile(path.join(fixturesDir, 'testview.html'), 'utf-8')
  });

  // Test view injection
  assert(result.includes('<h1>Hello from view</h1>'), 'View content should be injected');
  assert(result.includes('<view-root>'), 'view-root tag should be present');
  
  // Test CSS injection
  assert(result.includes('<link tag="css" rel="stylesheet"'), 'CSS link should be properly configured');
  assert(result.includes(`href="/public/css/${viewName}.css"`), 'CSS href should be correct');

  // Test JS injection
  assert(result.includes('<script tag="js"'), 'JS script tag should be present');
  assert(result.includes(`src="/public/js/${viewName}.js"`), 'JS src should be correct');

  // Test basic HTML structure
  assert(result.includes('<html>'), 'HTML structure should be preserved');
  assert(result.includes('</body>'), 'HTML structure should be preserved');

  console.log('✅ renderHtmlView test passed');
})();