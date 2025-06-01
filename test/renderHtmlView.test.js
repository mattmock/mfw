// renderHtmlView.test.js
const path = require('path');
const fs = require('fs/promises');
const assert = require('assert');
const { renderHtmlView } = require('../lib/renderHtmlView');

describe('renderHtmlView', () => {
  it('should render a complete HTML page with CSS and JS', async () => {
    const result = await renderHtmlView('test', {
      appPath: path.join(__dirname, 'fixtures/app.html'),
      viewsDir: path.join(__dirname, 'fixtures/views'),
      publicDir: 'public'
    });

    assert(result.includes('<link rel="stylesheet" href="/public/css/main.css"'), 'Main CSS link should be present');
    assert(result.includes('<link rel="stylesheet" href="/public/css/test.css"'), 'View CSS link should be present');
    assert(result.includes('<script src="/public/js/main.js"'), 'Main JS script should be present');
    assert(result.includes('<script src="/public/js/test.js"'), 'View JS script should be present');
  });

  it('should handle missing CSS and JS files', async () => {
    const result = await renderHtmlView('empty', {
      appPath: path.join(__dirname, 'fixtures/app.html'),
      viewsDir: path.join(__dirname, 'fixtures/views'),
      publicDir: 'public'
    });

    assert(result.includes('<link rel="stylesheet" href="/public/css/main.css"'), 'Main CSS link should be present');
    assert(!result.includes('empty.css'), 'Missing CSS should not be included');
    assert(result.includes('<script src="/public/js/main.js"'), 'Main JS script should be present');
    assert(!result.includes('empty.js'), 'Missing JS should not be included');
  });

  it('should process structs and parts correctly', async () => {
    const result = await renderHtmlView('with-structs', {
      appPath: path.join(__dirname, 'fixtures/app.html'),
      viewsDir: path.join(__dirname, 'fixtures/views'),
      publicDir: 'public'
    });

    assert(result.includes('struct-content'), 'Struct content should be injected');
    assert(result.includes('part-content'), 'Part content should be injected');
    assert(result.includes('<link rel="stylesheet" href="/public/css/struct.css"'), 'Struct CSS should be included');
    assert(result.includes('<link rel="stylesheet" href="/public/css/part.css"'), 'Part CSS should be included');
  });
});