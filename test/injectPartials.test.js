// injectPartials.test.js
const path = require('path');
const { injectPartials } = require('../lib/injectPartials');
const assert = require('assert');

(async () => {
  const partialPath = path.join(__dirname, 'fixtures', 'partials', 'card', 'index.html');

  // Test slot injection
  const result = await injectPartials(partialPath, {
    slots: {
      header: '<h2>Test Header</h2>',
      body: '<p>Test Body</p>'
    },
    data: {
      label: 'Test Button'
    }
  });

  // Test slot content
  assert(result.html.includes('Test Header'), 'Header slot should be injected');
  assert(result.html.includes('Test Body'), 'Body slot should be injected');
  assert(!result.html.includes('<slot'), 'No slot tags should remain');

  // Test data interpolation
  assert(result.html.includes('Test Button'), 'Data attribute should be interpolated');

  // Test CSS path
  assert(result.cssPath === '/partials/card/style.css', 'CSS path should be correct');

  console.log('✅ injectPartials test passed');
})(); 