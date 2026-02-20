// Run $ npm test
const assert = require('assert');
const I18n = require('../i18n');

describe('i18n-2 configuration and caching', () => {
  it('should configure', () => {
    const i18n = new I18n({
      locales: ['en', 'de'],
      directory: './locales',
      extension: '.json'
    });

    assert.equal(i18n.directory, './locales');
    assert.equal(i18n.extension, '.json');
  });

  it('should cache locales in production mode', () => {
    // Clear any existing cache
    I18n.localeCache = {};

    // Create instance in production mode
    const i18n1 = new I18n({
      locales: ['en', 'de'],
      devMode: false
    });

    i18n1.setLocale('en');
    const result1 = i18n1.__('Hello');

    // Check that cache was populated
    const cacheKeys = Object.keys(I18n.localeCache);
    assert.ok(cacheKeys.length > 0, 'Cache should be populated in production mode');

    // Create second instance - should use cache
    const i18n2 = new I18n({
      locales: ['en', 'de'],
      devMode: false
    });

    i18n2.setLocale('en');
    const result2 = i18n2.__('Hello');

    // Both should return same result
    assert.equal(result1, result2);
    assert.equal(result1, 'Hello');
  });

  it('should not cache in development mode', () => {
    // Clear cache
    I18n.localeCache = {};

    // Create instance in dev mode
    const i18n = new I18n({
      locales: ['en', 'de'],
      devMode: true
    });

    i18n.setLocale('en');
    i18n.__('Hello');

    // Cache should remain empty in dev mode
    const cacheKeys = Object.keys(I18n.localeCache);
    assert.equal(cacheKeys.length, 0, 'Cache should not be populated in dev mode');
  });
});
