const path = require('path');
const assert = require('assert');
const { injectByName } = require('../lib/injectByName');

async function runTests() {
  console.log('🧪 Running injectByName tests...');

  // Test 1: Basic struct and part injection
  try {
    const result = await injectByName(path.join(__dirname, 'fixtures', 'test.html'), {
      type: 'view'
    });
    assert(result.includes('<h1>Card Header</h1>'), 'Should contain header content');
    assert(result.includes('<p>Card Content</p>'), 'Should contain content');
    console.log('✅ Test 1: Basic struct/part injection passed');
  } catch (error) {
    console.error('❌ Test 1 failed:', error);
  }

  // Test 2: Missing name attribute
  try {
    await injectByName(path.join(__dirname, 'fixtures', 'missing-name.html'), {
      type: 'view'
    });
    assert.fail('Should throw error for missing name attribute');
  } catch (error) {
    assert(error.message.includes('missing name attribute'), 'Should throw correct error');
    console.log('✅ Test 2: Missing name attribute validation passed');
  }

  // Test 3: Invalid nesting
  try {
    await injectByName(path.join(__dirname, 'fixtures', 'invalid-nesting.html'), {
      type: 'view'
    });
    assert.fail('Should throw error for invalid nesting');
  } catch (error) {
    assert(error.message.includes('cannot contain other structs'), 'Should throw correct error');
    console.log('✅ Test 3: Invalid nesting validation passed');
  }

  // Test 4: Part content injection
  try {
    const result = await injectByName(path.join(__dirname, 'fixtures', 'part-content.html'), {
      type: 'view'
    });
    assert(result.includes('Injected Content'), 'Should contain injected content');
    console.log('✅ Test 4: Part content injection passed');
  } catch (error) {
    console.error('❌ Test 4 failed:', error);
  }

  console.log('✨ All tests completed!');
}

runTests().catch(console.error); 