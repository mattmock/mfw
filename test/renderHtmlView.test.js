// renderHtmlView.test.js
const path = require('path');
const fs = require('fs/promises');
const assert = require('assert');
const { renderHtmlView } = require('../lib/renderHtmlView');

(async () => {
  const viewName = 'testview';
  const layoutPath = path.join(__dirname, 'fixtures', 'layout.html');
  const viewPath = path.join(__dirname, 'fixtures', `${viewName}.html`);

  // Run render
  const result = await renderHtmlView(viewName, {
    view: await fs.readFile(viewPath, 'utf-8')
  });

  assert(result.includes('<h1>Hello from view</h1>'));
  assert(result.includes('<html>'));
  assert(result.includes('</body>'));

  console.log('✅ renderHtmlView test passed');
})();