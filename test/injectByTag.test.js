// injectByTag.test.js
const path = require('path');
const { injectByTag } = require('../lib/injectByTag');
const assert = require('assert');

(async () => {
  const partialPath = path.join(__dirname, 'fixtures', 'card.html');

  // Injected result
  const result = await injectByTag(partialPath, {
    title: 'Injected Title',
    desc: 'Injected Description'
  });

  assert(result.includes('Injected Title'));
  assert(result.includes('Injected Description'));
  assert(!result.includes('Default Title'));
  assert(!result.includes('Default description'));

  console.log('✅ injectByTag test passed');
})();